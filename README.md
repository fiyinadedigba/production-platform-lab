# Production Platform API with Observability 🚀

Overview

This project demonstrates how to design, deploy, and operate a production-grade backend service using modern DevOps, cloud-native, and SRE practices.

It includes:

- CI/CD with GitHub Actions  
- Containerization with Docker  
- Kubernetes deployment using Helm  
- GitOps with ArgoCD  
- Automated image updates.
- Observability with Prometheus & Grafana
- AI-assisted incident analysis workflow
---
🧩 What problem this solves

Backend services are often easy to build but hard to operate reliably.

Common issues:
- Manual deployments introduce risk
- Limited visibility into system health
- No clear way to detect or respond to failures
- Lack of real-time insights during incidents

This project focuses on solving those problems by building a system that is:
- **Deployable**
- **Observable**
- **Reliable**
- **Operable in production-like environments**
---

## 🧭 End-to-End Flow

``` txt
Developer pushes code
↓
GitHub Actions builds & tests
↓
Docker image pushed to GHCR
↓
ArgoCD Image Updater detects new image version 
↓
Git is updated automatically
↓
ArgoCD syncs desired state
↓
Helm deploys to Kubernetes
↓
Prometheus scrapes metrics
↓
Grafana visualizes system health
↓
`/analyze` endpoint provides insights

```
---
## 🏗️ Architecture

- **Node.js API** — Incident management service  
- **PostgreSQL** — Data persistence  
- **Docker** — Containerization  
- **Kubernetes** — Orchestration  
- **Helm** — Deployment templating  
- **Argo CD** — GitOps continuous delivery  
- **ArgoCD Image Updater** — Automated image updates  
- **Prometheus** — Metrics collection  
- **Grafana** — Dashboards and alerting 

---
## 🚀 CI/CD Pipeline

![GitHub Actions](docs/images/ci-pipeline.png)

Automated pipeline builds, tests, and publishes versioned Docker images.

---

## 📦 Container Registry (GHCR)

![GHCR Images](docs/images/ghcr-images.png)

Images are versioned (`v1.x.x`) for reproducible deployments.

---
## 🔁 GitOps Deployment (ArgoCD)

![ArgoCD](docs/images/argocd-synced.png)

ArgoCD continuously syncs the desired state from Git to Kubernetes.

---

## ☸️ Kubernetes Runtime

![Kubernetes](docs/images/kubernetes-pods.png)

Application is deployed as a Kubernetes Deployment with a Service for networking.

---

## 📊 Observability in Action

### Prometheus Metrics

![Prometheus](docs/images/prometheus-targets.png)

#### Queries

![Prometheus](docs/images/Prometheusqueries.png)

**Example query:
```txt
sum(ai_analysis_total) by (severity
)
```
---

### Grafana dashboard

Shows AI analysis usage, latency, and system behavior in real time.

![Grafana](docs/images/Grafananew.png)
---

### Alerting (Email)

This alerts were triggered by simulated API failures using /simulate-error.
 Alert was sent via SMTP.

![Alerting](docs/images/alerts.png)

![Email](docs/images/email_alert.png)
---
## 🚀 Getting Started

### Prerequisites

- Docker
- Kubernetes (kind)
- Helm
- kubectl
- Node.js

### Run Locally (development)

```bash
cd app
npm install
npm run dev
```
### Run Tests
```bash
npm test
```
### Build and run with Docker
```bash
docker build -t production-platform-api .
docker run -p 3000:3000 production-platform-api

```
### Kubernetes

Deployed via Helm + Argo CD (GitOps workflow)

### Access services
- **API**

```bash
kubectl port-forward svc/production-platform-api 8080:80
```

- **Grafana**

```bash
kubectl port-forward svc/monitoring-grafana -n monitoring 3001:80
```

- **ArgoCD**

```bash
kubectl port-forward svc/argocd-server -n argocd 8082:443
```
---
## ✨ Key Features

- Node.js API service
- Dockerized application
- CI pipeline with GitHub Actions
- Container images published to GitHub Container Registry (GHCR)
- Kubernetes deployment using Helm
- GitOps-based delivery with ArgoCD
- Automated image updates using ArgoCD Image Updater
- Observability with Prometheus and Grafana
- AI-powered analysis endpoint for system insights
---

## 🔁 Automated Image Updates

The platform uses ArgoCD Image Updater to automatically detect new container image versions in GHCR and update deployments via GitOps.

This removes the need for manual image tag changes and keeps deployments continuously in sync with the latest builds.

---
## ⚙️ Features

### API Service
- CRUD operations for incidents
- JWT-based authentication
- Input validation and error handling

### DevOps & Deployment
- CI pipeline with GitHub Actions
- GitOps-based deployment with Argo CD
- Automatic version rollout using image updater
- Versioned releases via Git tags

### Observability
- Prometheus metrics:
  - Request count
  - Error rate
  - Request latency (p95)
  - AI usage and duration
- Grafana dashboards:
  - AI usage by severity
  - Analysis rate
  - Latency trends

### Security
- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- Security headers (helmet)

---

## 🤖 AI Incident Analysis

The system includes an AI-assisted endpoint:

```bash
POST /incidents/:id/analyze
```
**This feature:**

- Analyzes incident severity and description
- Generates insights and recommendations
- Persists results in the database
- Emits metrics for observability

**Example output**
```JSON
{
  "analysis": "High severity incident detected...",
  "recommendation": "Check deployments, logs, and latency metrics..."
}

```
---
📊 Observability & SRE

Metrics
- http_requests_total
- http_request_duration_seconds
- ai_analysis_total
- ai_analysis_duration_seconds
Alerts
- High error rate
- High latency (p95)
- AI analysis spikes
Failure Simulation
- /simulate-error
- /simulate-latency

---

## 📈 Service Level Objectives (SLOs)

- Availability: 99% successful requests
- Latency: p95 < 300ms
---
## 💥 Reliability Engineering

This project includes controlled failure scenarios to test system behavior:

- Simulated API failures
- Simulated latency spikes
This helps validate monitoring, alerting, and response mechanisms.

---
## ⚙️ Design Decisions

- **Helm**  
  Used for templated and reusable Kubernetes deployments.

- **ArgoCD**  
  Enables GitOps-based continuous delivery with Git as the source of truth.

- **GHCR (GitHub Container Registry)**  
  Integrated with GitHub Actions for seamless image publishing.

- **Versioned Docker Images**  
  Ensures reproducibility, traceability, and safe rollbacks.

---
## 🧱 GitOps Bootstrap (App of Apps)

The repository includes a basic App-of-Apps setup demonstrating how ArgoCD can manage both infrastructure and application deployments from Git.

A root application (root-app) references child applications, including:

- ArgoCD itself (via Helm)
- The API service

This pattern is commonly used to bootstrap and manage environments declaratively.

---

## 📁 Project Structure
```txt

production-platform-lab/
├── .github/workflows/             # CI pipelines (build & push images)
├── app/                           # Node.js API service
├── docs/                          # Documentation & screenshots
├── gitops/                        # GitOps configuration (ArgoCD)
│   ├── apps/                      # ArgoCD applicatioAPI + platform components)
│   ├── bootstrap/               App-of-apps root configurationern)
│   └── image-updater/           Automated image update configurationfig
├── infrastructure/
│   └── kubernetes/helm/
│       └── production-platform-api/   # Helm chart for API deployment
├── scripts/                       # Utility scripts
└── README.md
```
---

## 🔮 Future Improvements

- Replace rule-based AI with LLM integration
- Add distributed tracing (OpenTelemetry)
- Implement autoscaling (HPA)
- Integrate external secrets management
---

🧑‍💻 Author

Built as a hands-on exploration of production systems, DevOps workflows, and SRE practices.
