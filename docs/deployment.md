# Deployment Guide

This project demonstrates a production-style deployment pipeline using:

- GitHub Actions (CI)
- Docker
- GitHub Container Registry (GHCR)
- Kubernetes (kind)
- Helm

---

## Architecture Overview

Code → CI Pipeline → Docker Image → GHCR → Helm → Kubernetes

---

## Prerequisites

Install:

- Node.js
- Docker
- kubectl
- Helm
- kind

---

## 1. Run Locally

```bash
cd app
npm install
npm run dev

## Test:
```bash
curl http://localhost:3000/health
```
---

#  Build & Run with Docker
``` bash
docker build -t production-platform-api ./app
docker run -p 3000:3000 production-platform-api
```
---

# CI Pipeline
On every push:
- Installs dependencies
- Runds tests
- Builds Docker image
- Runs container test
- Pushes image to GHCR

Images are tagged as:
- latest
- commit SHA
- version tags (v1.x.x)
---

# Kubernetes Deployment (Local)
Create cluster:

```bash
kind create cluster --name production-platform-lab
```

Deploy using Helm:
```bash
helm install production-platform-api infrastructure/kubernetes/helm/production-platform-api
```

---

# 5. Deploy Specific Version
Use the deploy script
```bash
./scripts/deploy-local.sh v1.0.1
```
---

# 6. Verify Deployment

```bash
kubectl get pods
kubectl describe deployment production-platform-api | grep Image
```
---

# 7. Access the service
```bash
kubectl port-forward svc/production-platform-api 8080:80
```

Then
```bash
curl http://localhost:8080/health
```

---

# Key Features
- Versioned deployments (no reliance on latest)
- Reproducible infrastructure using Helm
- Health checks via readiness/liveness probes
- End-to-end CI → deploy workflow
---

# Future Improvements
- ArgoCD (GitOps deployment)
- Multi-environment setup (dev/staging/prod)
- Observability (Prometheus + Grafana)
- Secrets management
---
