---
title: "📞 Guide to Building an Amazon Connect-Based Automated On-Call Voice Alert System"
description: "Architectural and deployment specification of a cloud-native on-call alert system that automatically dials responsible engineers when CloudWatch Alarms trigger."
pubDate: "2026-06-01"
heroImage: ""
categories: ["AWS", "Amazon Connect", "Serverless"]
---

This is an automated alert system designed to automatically place telephone calls to on-call engineers when unexpected system failures (CloudWatch Alarms) occur, helping teams immediately recognize and respond to incidents.

By combining Amazon Connect with Amazon Polly's Text-to-Speech (TTS) engine, the system dynamically synthesizes and reads out the specific alarm context and the name of the failing service in real-time Korean voice, avoiding hardcoded messages.

---

## 1. Architecture and Data Flow

The system architecture queues CloudWatch alerts through SNS and SQS buffering, which then trigger Lambda to initiate outbound voice calls via Amazon Connect.

### E2E Architecture Diagram
![On-Call System Architecture](https://raw.githubusercontent.com/realx1017/service-on-call/main/generated-diagrams/oncall-architecture.png)

### Text Architecture Map
```mermaid
graph TD
    CW[CloudWatch Alarm] -->|Send Alert| SNS[SNS Topic: dev-oncall-alert]
    SNS -->|Deliver Subscription| SQS[SQS Queue: dev-oncall-queue]
    SQS -->|Event Source Mapping (Batch=1)| Lambda[Lambda: dev-oncall-caller]
    Lambda -->|1. Query Service Name| DynamoDB[(DynamoDB: dev-oncall-contacts)]
    Lambda -->|2. Outbound Call API| Connect[Amazon Connect: dev-on-call]
    Connect -->|Pass Attributes| Flow[oncall-tts-flow]
    Flow -->|SSML Speech & Connect Phone| Recipient([On-Call Engineer])
```

### Architectural Resource Specifications
- **Amazon Connect (`dev-on-call`)**: Acts as the TTS engine and routes outbound calls to physical devices.
- **DynamoDB (`dev-oncall-contacts`)**: Manages the name and phone number information of the on-call engineers for each service.
- **Lambda (`dev-oncall-caller`)**: Pulls, parses alarm messages from the SQS queue, queries the on-call engineer from DynamoDB, and calls the Connect API.
- **SNS Topic (`dev-oncall-alert`)**: Acts as a gateway to receive CloudWatch Alarm events.
- **SQS Queue (`dev-oncall-queue`)**: Buffers messages safely during alarm surges and throttles/controls API call rates.
- **SQS DLQ (`dev-oncall-queue-dlq`)**: Isolate failed call messages after 3 retries to track call history.

---

## 2. Amazon Connect Detailed Configurations and Billing Specs

### ① Instance Creation Specifications
- **Identity Management**: Adopted `CONNECT_MANAGED` method.
- **Telephony Options**: Inbound Calls (Disabled) / Outbound Calls (Enabled).
- **Security Configurations**:
  - Customer Profiles and Email features are **disabled** since they are unnecessary for on-call notification purposes.
  - Administrator access is permitted only through Emergency Access via the AWS Console, and the administrator role is set to "None" to prevent credential exposure.
  - We evaluate the implementation of Authentication Profiles (Preview) to restrict IP access.

### ② Contact Flow (IaC Managed)
Managed as code via Terraform (`aws_connect_contact_flow`), bypassing manual creation on the AWS Console. (Configuration file: `config/connect/contact_flow/oncall-tts-flow.yaml`)
- **Operational Order**: Entry Point ➡️ Play Prompt (SSML, Korean text-to-speech) ➡️ Disconnect
- **SSML Speech Configuration**: Set the Contact Flow TextType to **`ssml`** so that Amazon Polly correctly pronounces the attributes (`$.Attributes.message`) passed by Lambda in Korean.

### ③ Cost Structure and Benefits
- **Base Cost**: There is **no base maintenance fee** for the instance, following a pay-as-you-go billing model.
- **Call Cost**: Voice outbound calls cost $0.038/minute, and South Korea DID phone numbers cost approximately $0.06/day to maintain.
- **Core Advantage**: If no phone number is allocated or no calls are placed, the **base operating cost is $0 (Zero)**, drastically minimizing infrastructure maintenance costs.

---

## 3. DynamoDB Table and Data Model

Using a combination of Partition Key and Sort Key, we can bind multiple on-call targets per service and call all queried targets sequentially.

### Schema Specifications
- **Partition Key**: `service` (String)
- **Sort Key**: `contact_id` (String - `primary` | `secondary`, etc.)
- **Attributes**: `name` (String), `phone` (String - adheres to E.164 international standard)

### Data Model Example

| service (PK) | contact_id (SK) | name | phone |
| :--- | :--- | :--- | :--- |
| `user-api` | `primary` | Chulsoo Kim | `+821012345678` |
| `user-api` | `secondary` | Younghee Park | `+821098765432` |
| `payment-api` | `primary` | Minsu Lee | `+821055556666` |

### CLI Command Example to Add Contact
```bash
aws dynamodb put-item \
  --table-name dev-oncall-contacts \
  --item '{"service":{"S":"user-api"},"contact_id":{"S":"primary"},"name":{"S":"Chulsoo Kim"},"phone":{"S":"+821012345678"}}' \
  --profile dev_nomfa \
  --region ap-northeast-2
```

---

## 4. Lambda Handler and Business Logic

### ① Environment Variables
- **`DYNAMODB_TABLE`**: Target DynamoDB table name (`dev-oncall-contacts`)
- **`CONNECT_INSTANCE_ID`**: Automatically bound from Terraform internal resource ARN/ID
- **`CONNECT_CONTACT_FLOW_ID`**: Automatically bound from Terraform internal resource contact_flow_id
- **`SOURCE_PHONE_NUMBER`**: Outbound source number allocated in Connect (manually specified)

### ② Python Handler Source Code (`index.py`)
```python
import json
import os
import boto3

dynamodb = boto3.resource("dynamodb")
connect = boto3.client("connect")

TABLE_NAME = os.environ["DYNAMODB_TABLE"]
INSTANCE_ID = os.environ["CONNECT_INSTANCE_ID"]
CONTACT_FLOW_ID = os.environ["CONNECT_CONTACT_FLOW_ID"]
SOURCE_PHONE = os.environ["SOURCE_PHONE_NUMBER"]

def handler(event, context):
    for record in event["Records"]:
        # 1. Decode SNS message received from SQS queue
        body = json.loads(record["body"])
        message = json.loads(body["Message"])
        
        alarm_name = message.get("AlarmName", "Unknown")
        new_state = message.get("NewStateValue", "")
        
        # 2. Proceed with business logic only when state is ALARM
        if new_state != "ALARM":
            continue
            
        # 3. Parse target service name from alarm name (formatted as {service}-{metric})
        service_name = extract_service_name(alarm_name)
        
        # 4. Query DynamoDB to retrieve the list of on-call contacts designated for the service
        contacts = get_oncall_contacts(service_name)
        if not contacts:
            print(f"No contacts found for service: {service_name}")
            continue
            
        # 5. Combine SSML speech sentences and invoke outbound APIs for each contact
        tts_message = f'<speak><lang xml:lang="ko-KR">{service_name} 서비스에서 장애가 발생했습니다. 확인하세요.</lang></speak>'
        for contact in contacts:
            make_call(contact["phone"], tts_message)

def extract_service_name(alarm_name):
    parts = alarm_name.rsplit("-", 2)
    return parts[0] if len(parts) > 1 else alarm_name

def get_oncall_contacts(service_name):
    table = dynamodb.Table(TABLE_NAME)
    response = table.query(
        KeyConditionExpression="service = :s",
        ExpressionAttributeValues={":s": service_name},
    )
    return response.get("Items", [])

def make_call(phone_number, message):
    try:
        connect.start_outbound_voice_contact(
            InstanceId=INSTANCE_ID,
            ContactFlowId=CONTACT_FLOW_ID,
            DestinationPhoneNumber=phone_number,
            SourcePhoneNumber=SOURCE_PHONE,
            Attributes={"message": message},
        )
        print(f"Call initiated to {phone_number}")
    except Exception as e:
        print(f"Failed to call {phone_number}: {e}")
```
