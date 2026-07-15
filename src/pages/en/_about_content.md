# Jeong-Yeol Cho
📞 +82 10-2871-9725  
📧 realx1017@naver.com

---

### Personal Statement
From an early age, I had a strong curiosity about computers, and by choosing a computer-related major, I became immersed in the server and security fields. After graduation, I started by building HPC (High-Performance Computing) clusters and directly designed and operated large-scale parallel computing environments for major domestic research institutions including Inha University, Korea Institute for Advanced Study, and Agency for Defense Development, establishing a deep infrastructure foundation. Subsequently, transitioning to the rapidly growing IT service environment, I moved to the AWS cloud ecosystem. Currently, leveraging over 18 years of experience, I have grown into a senior DevOps engineer leading serverless architecture design, Kubernetes operations, and IaC automation.

---

### Motivation for Application
Beyond simply operating infrastructure, I have a keen interest in infrastructure automation utilizing AI agents. Recently, I personally designed and implemented an AI failure analysis bot integrating AWS Bedrock with Slack, as well as an AI agent harness (Q-SE Harness) that automates everything from Terraform code writing to verification. I am applying because I am confident that these Cloud Native automation and AI Ops capabilities can make a substantial contribution to solving real business problems at your company.

---

### Goals After Joining
In the initial period after joining, I will focus on quickly understanding your company's infrastructure status and operational patterns to automate repetitive tasks that create bottlenecks. In the mid to long term, my goal is to build standardized infrastructure pipelines based on IaC and combine them with AI to create an intelligent operational system that enhances team productivity. Based on my CKA/CKAD certifications and over 18 years of field experience, I aim to become an engineer who contributes to the team in both technical depth and execution capability.

---

## Work Experience (18 years 7 months)

### Homeplus
**2022.04 - Present (4 years 4 months)** | Full-time

#### AI Ops Failure Analysis System Based on AWS Bedrock and Slack Interactivity
**Project: AI Ops Failure Analysis System Based on AWS Bedrock and Slack Interactivity**

- **Objective**: To reduce Mean Time to Recovery (MTTR) by automating log analysis and monitoring tasks that were previously performed manually when CloudWatch Alarms triggered, and to maximize operational efficiency by implementing a fully serverless AI Ops environment combining AWS Bedrock with Slack interactive features.
- **Key Activities and Contributions**:
  - Asynchronous Analysis Architecture Design: To overcome Slack Interactive API's 3-second timeout limitation, built a stable background inference pipeline by separating the Lambda Function URL receiver from the asynchronous self-invocation engine.
  - Multi-dimensional Resource/Log Collector Implementation: Automated CloudWatch Logs Insights queries and metric collection by namespace including ALB (Target Group health), ECS (Task/CPU/Memory usage), RDS (Connections/IOPS), DMS (CDC latency), Lambda (Errors/Throttles), etc.
  - Deployment History-based Root Cause Tracing: Developed an algorithm that precisely determines correlation with infrastructure changes by filtering ECS deployments and restart history executed within 30 minutes of the failure time.
  - Bedrock-based AI Analysis and Prompt Optimization: Integrated Cross-Region Inference Profile (global.anthropic.claude-sonnet-4-6) and performed system prompt engineering to derive root causes and immediate action steps within 1,500 characters.
- **Achievements**:
  - Significant reduction in initial failure analysis and response time (MTTR): Complete infrastructure status analysis to action guide confirmation within 30 seconds with a single button click in Slack.
  - Over 95% operational cost reduction with fully serverless architecture: Optimized infrastructure maintenance costs compared to EC2 operations by designing with 100% Lambda and Bedrock on-demand billing without always-on servers.
  - Security guidelines and least privilege compliance: Established secure security structure through token management via SSM Parameter Store and IAM Role API resource restriction settings.

#### Serverless Architecture-based On-Call Alert System and Cost Optimization
**Project: Serverless Architecture-based On-Call Alert System and Cost Optimization**

- **Objective**: To build a fully serverless on-call system using managed services such as Amazon SNS, SQS, DynamoDB, and Amazon Connect to reduce operational costs and implement large-scale calling stability and flexible failure alerts.
- **Key Activities and Contributions**:
  - Designed and built a fully serverless alert pipeline architecture based on Amazon SES, SNS, SQS, and Lambda.
  - Applied SQS buffering and Lambda concurrency control (Reserved Concurrency) to resolve Amazon Connect API call rate limit issues.
  - Designed and implemented alert recipient (phone number) management logic using AWS DynamoDB.
  - Voice calling via Amazon Connect.
- **Achievements**:
  - Significantly improved system scalability, availability, and maintainability.
  - Implemented flexible phone number management system based on DynamoDB.
  - Stable failure alert delivery even during large-scale traffic.

#### ElasticSearch Coordinator Node EC2 → ECS Fargate Migration
**Project: ElasticSearch Coordinator Node EC2 → ECS Fargate Migration for Cost Reduction**

- **Objective**: To migrate ElasticSearch Coordinator Nodes from existing EC2 to ECS Fargate to save approximately 100 million KRW annually in infrastructure costs and improve to a structure that can respond more quickly and flexibly through Auto Scaling during traffic increases.
- **Key Activities and Contributions**:
  - Containerization of ElasticSearch Coordinator Node images and ECR registration.
  - ECS Fargate service definition and deployment architecture design.
  - Fargate-based Auto Scaling policy establishment and implementation.
- **Achievements**:
  - Expected annual infrastructure cost savings of approximately 100 million KRW.
  - Flexible response through Auto Scaling during traffic increases and improved service stability.
  - Reduced EC2 management overhead and increased operational efficiency.

#### RDS Snapshot to S3
**Project: RDS Snapshot to S3**

- **Objective**: To configure automated tasks that store data to S3 using daily RDS snapshots, and to receive Slack notifications when export fails using EventBridge to receive RDS event category ID values. Ensure availability and stability of cloud infrastructure management and maintain business continuity.
- **Key Activities and Contributions**:
  - Built system for automatic RDS snapshot backup to S3 using AWS Lambda and EventBridge.
  - Implemented RDS event-based snapshot export failure notification (Slack) feature.
- **Achievements**:
  - Improved disaster recovery capability through RDS data backup automation and stability assurance.
  - Established rapid detection and response system for snapshot export failures.
  - Ensured infrastructure operational stability and business continuity.

#### ECS Fargate and Aurora MySQL RDS Autoscaling Implementation
**Project: ECS Fargate and Aurora MySQL RDS Autoscaling Implementation**

- **Objective**: To apply Scale out during event-heavy and high-traffic times, and Scale in during other times to optimize ECS Fargate container resources and reduce costs.
- **Key Activities and Contributions**:
  - Implemented auto-scaling policies for ECS Fargate services and Aurora MySQL RDS instances.
  - Set up scaling triggers based on specific time periods or events using EventBridge.
  - Developed and tested Scale-out/in logic.
- **Achievements**:
  - Cost reduction through computing and DB resource optimization based on traffic patterns.
  - Improved service availability and performance (rapid expansion during load, resource savings during idle).
  - Reduced operational automation and management overhead.

#### Braze Push Schedule Event Automation
**Project: Braze Push Schedule Event Automation**

- **Objective**: To automatically retrieve daily event-based push schedules using Braze's calendar API, automatically register schedules in EventBridge at the designated times to reduce repetitive work, and write functions to receive added event schedules via Slack and email.
- **Key Activities and Contributions**:
  - Developed Braze calendar API integration and data collection logic.
  - Built scheduling automation pipeline using AWS EventBridge.
  - Implemented Slack and Email notification features through Lambda functions.
- **Achievements**:
  - Increased work efficiency by eliminating repetitive manual tasks.
  - Reduced human errors and improved scheduling accuracy.
  - Built real-time notification system for event schedules.

---

### Brandi
**2020.05 - 2022.03 (1 year 11 months)** | Full-time

#### CI/CD Configuration Automation
**Project: CI/CD Configuration Automation**

- **Objective**: To codify repetitive CodePipeline and CodeBuild creation with Terraform to reduce repetitive work and minimize human errors.
- **Key Activities and Contributions**:
  - Automated AWS CodePipeline and CodeBuild resources as IaC (Infrastructure as Code) using Terraform.
  - Developed CI/CD pipeline templates and ensured reusability.
- **Achievements**:
  - Reduced CI/CD environment setup time and repetitive work.
  - Minimized human errors and increased deployment process consistency.
  - Improved development productivity and secured deployment stability.

#### Infrastructure Automation Using Terraform
**Project: Infrastructure Automation Using Terraform**

- **Objective**: To codify repetitive Subnet configuration with Terraform for rapid creation. Codified public subnet, private subnet, NAT configuration, etc.
- **Key Activities and Contributions**:
  - Automated Subnet and NAT Gateway configuration within VPC using Terraform modules.
  - Developed reusable network infrastructure code.
- **Achievements**:
  - Reduced network infrastructure setup time and configuration errors.
  - Maintained infrastructure consistency and increased management efficiency.

#### WAS Server EKS Migration
**Project: WAS Server EKS Migration**

- **Objective**: To migrate existing EC2-based WAS servers to Kubernetes and resolve existing issues. Enhance service stability through Auto Scaling via HPA, configure Grafana and Prometheus to graph metrics information and enable viewing of Pod counts and metrics information during problem periods.
- **Key Activities and Contributions**:
  - Migrated EC2-based WAS to EKS (Elastic Kubernetes Service).
  - Implemented service auto-scaling using HPA (Horizontal Pod Autoscaler).
  - Built monitoring system using Grafana and Prometheus with dashboard visualization.
  - Built CI/CD pipeline using CodeCommit, CodeBuild, and CodePipeline.
- **Achievements**:
  - Significantly improved WAS server scalability and availability.
  - Increased resource utilization efficiency and cost optimization (auto-scaling).
  - Established real-time monitoring and rapid analysis and response system for problem occurrence.

---

### ST Unitas
**2015.11 - 2020.04 (4 years 6 months)** | Full-time

#### ELK Stack-based Container Log Analysis System
**Project: ELK Stack-based Container Log Analysis System**

- **Objective**: To build a system that loads all container logs generated in k8s into Elasticsearch and enables analysis in Kibana. Install filebeat and metricbeat on k8s Worker nodes to load container logs, filter ELB access logs stored in AWS S3 with logstash and load into elasticsearch, create graphs and maps based on geoip and elb_status_code from ELB access logs in Kibana.
- **Key Activities and Contributions**:
  - Built container log and metric collection system using Filebeat and Metricbeat in Kubernetes environment.
  - Parsed ELB access logs using Logstash and loaded into Elasticsearch.
  - Implemented log analysis dashboards and geo-information/status code-based visualization using Kibana.
- **Achievements**:
  - Built centralized collection and analysis system for Kubernetes container logs and ELB access logs.
  - Improved real-time monitoring and problem diagnosis capability using log data.
  - Supported data-driven service operation and decision making.

#### ELK Stack-based RDS Slow Query Reporting
**Project: ELK Stack-based RDS Slow Query Reporting**

- **Objective**: To download slow query logs generated from RDS, store in ELK, and create dashboards in Kibana to view stored data as graphs. Report daily slow queries to share with developers and support prevention and remediation of failures caused by slow queries.
- **Key Activities and Contributions**:
  - Built RDS slow query log collection and loading pipeline to ELK Stack.
  - Developed slow query visualization and reporting system using Kibana dashboards.
  - Automated regular slow query reports.
- **Achievements**:
  - Established prevention and rapid response system for slow queries, a major cause of RDS performance degradation.
  - Provided meaningful data for performance improvement to development teams.
  - Increased database operational stability and efficiency.

#### Kubernetes on AWS System Construction
**Project: Kubernetes on AWS System Construction**

- **Objective**: To build a kubernetes system on AWS using kops with container auto scaling to save EC2 costs and match container-based DEV, staging, and production environments to maintain identical system environments between development and production servers.
- **Key Activities and Contributions**:
  - Built AWS-based Kubernetes cluster using kops.
  - Implemented container Auto Scaling functionality.
  - Unified development, staging, and production environments to container-based architecture.
- **Achievements**:
  - EC2 resource cost reduction and efficient resource utilization.
  - Reduced deployment errors by ensuring consistency between development and production environments.
  - Increased service scalability and flexibility through container-based architecture adoption.

#### CI/CD System Design and Construction
**Project: CI/CD System Design and Construction**

- **Objective**: To build a system for deployment in the order DEV→QA→staging→production. Design using gitlab-ci to deploy to servers for each branch, and design for developers to deploy quickly and stably to production systems. Configure deployment using docker+docker-compose.
- **Key Activities and Contributions**:
  - Designed and built multi-stage (DEV, QA, staging, production) deployment pipeline using GitLab CI.
  - Established container-based deployment environment using Docker and Docker Compose.
  - Implemented automatic deployment system according to branch strategy.
- **Achievements**:
  - Automated deployment process and improved speed.
  - Enhanced stability and quality management by deployment stage.
  - Increased collaboration efficiency between development and operations teams.

#### MySQL Replication
**Project: MySQL Replication**

- **Objective**: To configure MySQL replication with 1 Master and 2 Slaves to distribute MySQL load and develop scripts to perform daily MySQL full dumps at dawn and store on internal file servers.
- **Key Activities and Contributions**:
  - Built MySQL Master-Slave (1 Master, 2 Slaves) replication environment.
  - Configured replication for MySQL load distribution.
  - Developed automation script for daily MySQL Full Dump and file server storage.
- **Achievements**:
  - High availability and read load distribution for MySQL database.
  - Automated regular backups for data loss prevention.
  - Improved database service stability and performance.

#### Node.js Installation and Operations Management
**Project: Node.js Installation and Operations Management**

- **Objective**: To install 2 Node.js servers with redundancy using DNS round-robin. Install PM2 to manage process memory and add monitoring functionality using pm2-web. Add authentication feature to pm2-web for security.
- **Key Activities and Contributions**:
  - Built 2 Node.js servers with redundancy configuration using DNS round-robin.
  - Node.js process management using PM2 (memory, monitoring).
  - Enhanced security by adding authentication feature to PM2-Web.
- **Achievements**:
  - Implemented high availability and load balancing for Node.js applications.
  - Secured process stability and efficient resource management.
  - Built operational monitoring environment and enhanced security.

#### Monitoring System Construction (Nagios)
**Project: Monitoring System Construction (Nagios Core)**

- **Objective**: To deploy Nagios Core version to monitor web servers, DB servers, etc., execute automatic restarts using Jenkins API when system failures occur, and develop alarms using SMS and Push APP to notify responsible personnel. Since Nagios does not provide a graphical UI by default, build a Grafana UI system utilizing Nagios raw data.
- **Key Activities and Contributions**:
  - Built core infrastructure monitoring system based on Nagios Core for web servers, DB servers, etc.
  - Implemented automatic restart feature during failures through Jenkins API integration.
  - Developed alarm system via SMS and Push App.
  - Built visualization and dashboards for Nagios data using Grafana.
- **Achievements**:
  - Established real-time detection and automatic recovery system for system failures.
  - Built rapid notification delivery system to responsible personnel during failures.
  - Increased intuitive system status comprehension and operational efficiency through monitoring data visualization.

#### Public Cloud System Construction
**Project: Public Cloud System Construction**

- **Objective**: To build systems using AWS. Build web service systems using EC2, RDS, Redis (ElastiCache), Route53, ELB, etc., and manage accounts using IAM.
- **Key Activities and Contributions**:
  - Built infrastructure using various AWS services including EC2, RDS, ElastiCache, Route53, ELB.
  - Designed and implemented web service system architecture.
  - Account and permission management using IAM.
- **Achievements**:
  - Built scalable and stable web service infrastructure based on Public Cloud (AWS).
  - Enhanced infrastructure configuration and management capabilities in cloud environments.
  - Increased resource efficiency and operational flexibility.

#### Development Test Environment Using Vagrant (OS: RHEL6.6)
**Project: Development Test Environment Using Vagrant**

- **Objective**: To simplify different environments across developers (using Virtualbox on personal PCs) by using Vagrant and develop/manage Vagrantfiles. Build provisioning using Ansible.
- **Key Activities and Contributions**:
  - Standardized and built virtual development/test environments using Vagrant.
  - Environment configuration management through Vagrantfiles.
  - Implemented automatic provisioning system using Ansible.
- **Achievements**:
  - Reduced development environment setup complexity and ensured consistency.
  - Improved developer productivity and reduced errors due to environment inconsistencies.
  - Shortened development environment setup time.

#### Docker Container Deployment Automation Using Jenkins + GitHub Webhook
**Project: Docker Container Deployment Automation Using Jenkins + GitHub Webhook**

- **Objective**: To use GitHub webhook triggers on git push to integrate with Jenkins, build Docker images in Jenkins and store in Docker private registry, then automatically start containers on Docker host servers after pulling images.
- **Key Activities and Contributions**:
  - Built code change detection system through GitHub Webhook and Jenkins integration.
  - Automated Docker image build and private registry storage using Jenkins.
  - Implemented automatic container deployment and startup system on Docker Host Server.
- **Achievements**:
  - Complete CI/CD pipeline automation from Git Push to Docker container deployment.
  - Reduced deployment time and minimized errors from manual work.
  - Improved development productivity and service release speed.

---

### Clunix
**2011.03 - 2015.04 (4 years 2 months)** | Full-time

#### LG Display RnD Cloud Design System Construction
**Project: LG Display RnD Cloud Design System Construction**

- **Objective**: To build an environment where approximately 500 researchers can remotely execute desired S/W in 152 virtualized OS high-performance Cloud environments and store research data in integrated storage accessible from anywhere within the company.
- **Key Activities and Contributions**:
  - Designed and built research virtualization system based on high-performance Cloud environment.
  - Implemented remote execution environment for research S/W.
  - Built integrated storage system for research data.
- **Achievements**:
  - Improved researchers' S/W accessibility and research data sharing convenience.
  - Increased research environment efficiency and flexibility.
  - Enhanced research productivity and collaboration.

#### Agency for Defense Development Large-scale HPC and HA Cluster Environment Construction
**Project: Agency for Defense Development Large-scale HPC and HA Cluster Environment Construction**

- **Objective**: To enable approximately 300 users to access cluster systems through web UI, share research S/W licenses and integrate data, contributing to management efficiency of previously individual licenses. Build systems to enable VNC environment and X-forwarding for remote graphic resource utilization and performance similar to personal computers.
- **Key Activities and Contributions**:
  - Designed and built large-scale HPC (High-Performance Computing) and HA (High Availability) cluster environments.
  - Developed web UI-based S/W license sharing system and data integration system.
  - Built remote graphic work environment through VNC and X-forwarding.
- **Achievements**:
  - Significantly improved research S/W license management efficiency.
  - Improved research data sharing and collaboration environment.
  - Optimized remote graphic work performance and enhanced user convenience.

#### KIOST Virtualized Desktop System Construction
**Project: KIOST Virtualized Desktop System Construction**

- **Objective**: To build a satisfactory 3D desktop environment in virtual operating systems using OpenXEN and GPU passthrough. Enable research S/W execution in virtual OS using GPU Passthrough and enable viewing of work results from anywhere within KIOST with internet access.
- **Key Activities and Contributions**:
  - Built virtualized desktop environment using OpenXEN and GPU Passthrough technology.
  - Optimized virtual OS environment for research 3D S/W execution.
  - Ensured network connectivity and improved work result accessibility.
- **Achievements**:
  - Established environment for smooth execution of high-performance 3D S/W in virtual environments.
  - Improved researchers' work environment flexibility and accessibility.
  - Efficient utilization of GPU resources.

#### Hankook Tire High-Performance Parallel Computing Construction
**Project: Hankook Tire High-Performance Parallel Computing Construction**

- **Objective**: To build and design systems in the data center for abaqus work previously simulated on individual workstations, enabling all researchers to share licenses and work results within one HPC Cluster to increase work efficiency.
- **Key Activities and Contributions**:
  - Built abaqus simulation environment within HPC cluster.
  - Designed and implemented license and work result sharing system.
  - Integrated individual workstation environments into central HPC cluster.
- **Achievements**:
  - Significantly improved researchers' abaqus simulation work efficiency.
  - Improved collaboration environment through license and result sharing.
  - Centralized computing resources and efficient utilization.

#### Korea Gas Corporation RND and License Integration System Construction
**Project: Korea Gas Corporation RND and License Integration System Construction**

- **Objective**: To build a system that enables viewing of research application and system integration and license integration at a glance in web UI.
- **Key Activities and Contributions**:
  - Integrated research applications and systems.
  - Developed license integration management system.
  - Built web UI-based integrated management system.
- **Achievements**:
  - Improved integrated management and accessibility of research resources.
  - Increased license management efficiency and transparency.
  - Enhanced user convenience through intuitive web UI.

#### LG U+ OAM Server HA Clustering
**Project: LG U+ OAM Server HA Clustering**

- **Objective**: Project to increase MySQL availability. Not just monitoring System Fail or Network Fail status, but monitoring MySQL connection status to increase Fail detection accuracy.
- **Key Activities and Contributions**:
  - Configured MySQL high availability (HA) clustering for OAM servers.
  - Implemented MySQL connection status monitoring beyond simple system/network status monitoring.
- **Achievements**:
  - Ensured high availability and service continuity for MySQL database.
  - Minimized service downtime through improved Fail detection accuracy.
  - Built stable OAM service operational environment.

#### KBS NFS, Apache Server LB Clustering
**Project: KBS NFS, Apache Server LB Clustering**

- **Objective**: Project to increase SAMBA availability.
- **Key Activities and Contributions**:
  - Built NFS (Network File System) server.
  - Configured Apache web server Load Balancing (LB) clustering.
  - Implemented load balancing using IPVSADM.
  - Ensured high availability of Samba service.
- **Achievements**:
  - Ensured high availability and stability of Samba file service.
  - Distributed Apache web server traffic and improved performance.
  - Guaranteed file and web service continuity.

---

### Seoul National University College of Pharmacy Research Lab
**2008.10 - 2010.05 (1 year 8 months)** | Contract

#### Proxy Server Construction
**Project: Proxy Server Construction**

- **Objective**: To build a proxy server to enable researchers to access Seoul National University internal sites from KISTI IP ranges, as they previously could not access internal sites.
- **Key Activities and Contributions**:
  - Built and configured Squid proxy server.
  - Network access control and IP range-based access permission settings.
- **Achievements**:
  - Ensured researchers' access to Seoul National University internal network and business continuity.
  - Increased network security and access management efficiency.

#### Samba Server Construction (Used as Webdisk)
**Project: Samba Server Construction (Used as Webdisk)**

- **Objective**: Research and configure methods to utilize Samba as web disk.
- **Key Activities and Contributions**:
  - Built and configured Samba server.
  - Linked Samba as web disk using IntegraTUM WebDisk.
- **Achievements**:
  - Provided Samba-based web disk service.
  - Improved file sharing and access convenience.

---

### iKistech
**2006.10 - 2008.09 (2 years)** | Full-time

#### Korea Institute for Advanced Study HPC Linux Cluster 64 Units Construction and Maintenance
**Project: Korea Institute for Advanced Study HPC Linux Cluster 64 Units Construction and Maintenance**

- **Objective**: Investigation and installation of programs for computational servers.
- **Key Activities and Contributions**:
  - Server assembly and LAN cable fabrication.
  - Investigation and installation of computational programs.
- **Achievements**:
  - Contributed to HPC Linux cluster infrastructure construction.
  - Enhanced understanding of server hardware and network configuration.

#### Pai Chai University HPC Linux Cluster 20 Units Construction and Maintenance
**Project: Pai Chai University HPC Linux Cluster 20 Units Construction and Maintenance**

- **Objective**: Required monitoring program (ganglia) and benchmark report using HPL. OS installation and setup required for cluster.
- **Key Activities and Contributions**:
  - Cluster OS installation and configuration.
  - Ganglia monitoring program installation.
  - HPL benchmark execution and report writing.
- **Achievements**:
  - Acquired HPC cluster operation and performance benchmark capabilities.

#### Inha University Linux Cluster Construction and Maintenance
**Project: Inha University Linux Cluster Construction and Maintenance**

- **Objective**: Improve HPL performance through various tuning. OS installation and setup required for Linux cluster, MPICH1 and MPICH2 installation and setup required for parallel programs, Torque job scheduler setup, BMT execution using HPL.
- **Key Activities and Contributions**:
  - Linux cluster OS installation and configuration.
  - MPICH installation and configuration, Torque scheduler setup.
  - HPL Benchmark Test (BMT) execution.
  - Tuning work for HPC performance improvement.
- **Achievements**:
  - Enhanced HPC cluster performance optimization and tuning capabilities.
  - Experience in parallel programming environment setup and scheduler operation.
  - Completed high-performance computing system construction and delivery.

#### Korea Institute for Advanced Study Quad Core HPC Cluster 64 Units Construction and Maintenance
**Project: Korea Institute for Advanced Study Quad Core HPC Cluster 64 Units Construction and Maintenance**

- **Objective**: Separate computational network from file I/O network. Research switch stacking and search for methods to improve file I/O.
- **Key Activities and Contributions**:
  - Designed and implemented separation of computational network and file I/O network within HPC cluster.
  - Researched and applied switch stacking technology.
  - Researched file I/O performance improvement methods.
- **Achievements**:
  - Significantly improved HPC cluster network and file I/O performance.
  - Built stable computing environment and increased work speed.
  - Enhanced storage and backup technology capabilities.

---

## Education

### Anyang College of Science
**2001.03 - 2006.02** | Graduated | Webmaster

---

## Skills
- Linux System Administration
- GitLab
- Docker
- Amazon Web Services
- Linux

---

## Certifications & Awards

| Certification | Date | Description |
|---------------|------|-------------|
| Certified Kubernetes Application Developer (CKAD) | 2020.10 | CKAD Certification |
| Certified Kubernetes Administrator (CKA) | 2020.08 | CKA Certification |
| Network Administrator Level 2 | 2010.09 | Network Administrator Certification |
| Linux Master Level 1 | 2008.07 | Linux Master Level 1 Certification |
| Driver's License (Class 1 Regular) | 2005.12 | Driver's License |
