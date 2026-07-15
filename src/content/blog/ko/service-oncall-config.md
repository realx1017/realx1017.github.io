---
title: "📞 Amazon Connect 기반의 On-Call 자동 전화 경보 시스템 구축 가이드"
description: "CloudWatch Alarm 발생 시 담당자에게 자동으로 전화를 걸어 장애를 알리는 클라우드 네이티브 온콜(On-Call) 알림 시스템의 설계 및 구축 명세"
pubDate: "2026-06-01"
heroImage: ""
categories: ["AWS", "Amazon Connect", "Serverless"]
---

본 시스템은 시스템에 예기치 못한 장애(CloudWatch Alarm)가 발생했을 때, 담당자에게 자동으로 전화를 발신하여 즉각적인 인지가 가능하도록 돕는 자동 경보 시스템입니다. 

Amazon Connect와 Amazon Polly의 TTS(Text-to-Speech) 엔진을 결합하여, 하드코딩된 메시지가 아닌 장애가 발생한 서비스의 명칭 및 세부 알람 맥락을 실시간 한글 음성으로 합성해 낭독합니다.

---

## 1. 아키텍처 및 데이터 흐름 (Architecture)

시스템 아키텍처는 CloudWatch 경보 발생부터 SQS 버퍼링을 거쳐 아웃바운드 음성 통화로 전이되는 구조입니다.

### E2E 아키텍처 다이어그램
![On-Call System Architecture](https://raw.githubusercontent.com/realx1017/service-on-call/main/generated-diagrams/oncall-architecture.png)

### 텍스트 아키텍처 맵
```mermaid
graph TD
    CW[CloudWatch Alarm] -->|경보 전송| SNS[SNS Topic: dev-oncall-alert]
    SNS -->|구독 전달| SQS[SQS Queue: dev-oncall-queue]
    SQS -->|Event Source Mapping (Batch=1)| Lambda[Lambda: dev-oncall-caller]
    Lambda -->|1. 서비스명 쿼리| DynamoDB[(DynamoDB: dev-oncall-contacts)]
    Lambda -->|2. 아웃바운드 발신 API| Connect[Amazon Connect: dev-on-call]
    Connect -->|Attributes 전달| Flow[oncall-tts-flow]
    Flow -->|SSML 낭독 및 전화 연결| Recipient([온콜 담당자])
```

### 아키텍처 리소스 명세
- **Amazon Connect (`dev-on-call`)**: TTS 엔진 역할을 담당하며 아웃바운드 전화를 실제 기기로 전송합니다.
- **DynamoDB (`dev-oncall-contacts`)**: 서비스별 온콜 담당자의 이름 및 전화번호 정보를 관리합니다.
- **Lambda (`dev-oncall-caller`)**: SQS 큐로부터 알람 메시지를 수집, 파싱하여 DynamoDB에서 담당자를 찾고 Connect API를 호출합니다.
- **SNS Topic (`dev-oncall-alert`)**: CloudWatch Alarm 이벤트를 수신하는 게이트웨이 역할을 수행합니다.
- **SQS Queue (`dev-oncall-queue`)**: 대규모 알람 폭증 시 메시지를 안전하게 적재(버퍼링)하고 호출 빈도(Rate)를 제어합니다.
- **SQS DLQ (`dev-oncall-queue-dlq`)**: 발신에 실패한 메시지를 최대 3회 재시도 후 격리하여 이력을 추적합니다.

---

## 2. Amazon Connect 상세 설정 및 비용 사양

### ① 인스턴스 생성 규격
- **Identity Management**: `CONNECT_MANAGED` 방식 채택
- **통화 방향**: Inbound Calls (비활성화) / Outbound Calls (활성화)
- **보안 기능**:
  - 고객 프로필 활성화 및 Email 기능은 온콜 용도에 불필요하므로 모두 **해제**합니다.
  - AWS 콘솔을 통한 Emergency Access로만 관리자 접근을 허용하고 관리자를 "없음"으로 설정하여 권한 노출을 방지합니다.
  - IP 제한을 위해 Authentication Profile 기능(Preview) 적용을 검토합니다.

### ② Contact Flow (IaC 관리)
콘솔에서의 수동 생성을 배제하고 Terraform(`aws_connect_contact_flow`)을 사용하여 코드로 관리합니다. (설정 파일: `config/connect/contact_flow/oncall-tts-flow.yaml`)
- **동작 순서**: 진입점 ➡️ 재생 프롬프트(SSML, 한국어 낭독) ➡️ 연결 해제
- **SSML 낭독 설정**: Lambda가 전달한 Attributes 값(`$.Attributes.message`)을 Amazon Polly가 한국어로 올바르게 발음하도록 컨택트 플로우의 TextType을 **`ssml`**로 설정합니다.

### ③ 비용 구조 및 이점
- **기본 사용료**: 인스턴스 기본 유지 비용은 **무료**이며, 사용량 기반 과금(Pay-as-you-go)을 따릅니다.
- **통화 비용**: Voice 아웃바운드 통화료 $0.038/분 + 한국 DID 전화번호 유지 비용 약 $0.06/일이 발생합니다.
- **핵심 이점**: 전화번호를 할당하지 않거나 발신한 통화가 없을 경우 **기본 운영 비용이 $0(Zero)**이므로 인프라 유지 비용이 비약적으로 최소화됩니다.

---

## 3. DynamoDB 테이블 및 데이터 모델

Partition Key와 Sort Key 조합을 사용해 서비스당 여러 명의 온콜 대상자를 바인딩할 수 있으며, 쿼리된 모든 대상자에게 순차적으로 전화를 발신합니다.

### 테이블 스키마 구성
- **Partition Key**: `service` (String)
- **Sort Key**: `contact_id` (String - `primary` | `secondary` 등)
- **속성(Attributes)**: `name` (String), `phone` (String - E.164 국제 규격 준수)

### 데이터 모델 예시

| service (PK) | contact_id (SK) | name | phone |
| :--- | :--- | :--- | :--- |
| `user-api` | `primary` | 김철수 | `+821012345678` |
| `user-api` | `secondary` | 박영희 | `+821098765432` |
| `payment-api` | `primary` | 이민수 | `+821055556666` |

### 담당자 추가용 CLI 커맨드 예시
```bash
aws dynamodb put-item \
  --table-name dev-oncall-contacts \
  --item '{"service":{"S":"user-api"},"contact_id":{"S":"primary"},"name":{"S":"김철수"},"phone":{"S":"+821012345678"}}' \
  --profile dev_nomfa \
  --region ap-northeast-2
```

---

## 4. Lambda 핸들러 및 비즈니스 로직

### ① 환경 변수 (Environment Variables)
- **`DYNAMODB_TABLE`**: 대상 DynamoDB 테이블명 (`dev-oncall-contacts`)
- **`CONNECT_INSTANCE_ID`**: 테라폼 내부 리소스로부터 ARN/ID 자동 참조 바인딩
- **`CONNECT_CONTACT_FLOW_ID`**: 테라폼 내부 리소스로부터 contact_flow_id 자동 참조 바인딩
- **`SOURCE_PHONE_NUMBER`**: Connect에서 할당받은 아웃바운드 발신용 전화번호 (수동 지정)

### ② 파이썬 핸들러 소스 코드 (`index.py`)
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
        # 1. SQS 큐로부터 수신된 SNS 메시지 디코딩
        body = json.loads(record["body"])
        message = json.loads(body["Message"])
        
        alarm_name = message.get("AlarmName", "Unknown")
        new_state = message.get("NewStateValue", "")
        
        # 2. ALARM 상태 감지 시에만 비즈니스 로직 진행
        if new_state != "ALARM":
            continue
            
        # 3. 알람 이름에서 대상 서비스명 파싱 ({service}-{metric} 형태)
        service_name = extract_service_name(alarm_name)
        
        # 4. DynamoDB 쿼리를 통해 해당 서비스에 지정된 온콜 담당자 목록 획득
        contacts = get_oncall_contacts(service_name)
        if not contacts:
            print(f"No contacts found for service: {service_name}")
            continue
            
        # 5. SSML 한국어 낭독 문장 조합 및 각 담당자 대상 아웃바운드 API 호출
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
