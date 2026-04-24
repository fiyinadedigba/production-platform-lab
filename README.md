# Production Platform Lab
![CI](https://github.com/.../actions/workflows/ci.yml/badge.svg)
End-to-end platform engineering project covering CI/CD, cloud infrastructure, observability, security, and AI agent systems.
## End-to-End Flow

```txt
Developer pushes code
→ GitHub Actions builds & tests
→ Docker image pushed to GHCR
→ ArgoCD detects change
→ Helm deploys to Kubernetes
→ Application runs
--- 

## Current Progress

✅ Node.js API service  
✅ Dockerized application
✅ GitHub Actions CI
✅ Docker image pushed to GHCR
✅ Kubernetes deployment with Helm
✅ GitOps with ArgoCD
✅ Versioned image deployment

## Next Steps

- Github Actions CI
- Kubernetes deployment (Helm)
- GitOps with ArgoCD
- Terraform infrastructure (AWS)
- Observability (Prometheus, Grafana)
- Secrets management
- AI agent platform

## How to Run
```txt
See [Deployment Guide](docs/deployment.md)`

```md
## Design Decisions

- Helm chosen for templated Kubernetes deployments
- ArgoCD used for GitOps-based continuous delivery
- GHCR used as container registry integrated with GitHub Actions
- Versioned images ensure reproducibility and rollback safety
---

## Project Structure
```txt
production-platform-lab/
├── .github/workflows/
├── app/
├── docs/
├─gitops/
  ├── apps/
  └── environments/
├── infrastructure/kubernetes/helm/production-platform-api/
├── scripts/
└── README.md
```
