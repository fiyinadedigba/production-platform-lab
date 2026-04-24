# Node.js API Service

Simple Express-based API used as the core service for the Production Platform Lab.

## Endpoints

- `GET /health` → service health status
- `GET /version` → application version
- `GET /metrics` → placeholder for metrics (Prometheus later)

---

## Run Locally

```bash
npm install
npm run dev

## Test:
```bash
curl http://localhost:3000/health

## Run with Docker 
Build 
```bash
docker build -t production-platform-api .

Run: 
```bash
docker run -p 3000:3000 production-platform-api
```

Test
```bash
curl http://localhost:3000/health
```
---

## Tech Stack
- Node.js
- Express
- Docker
---

## Purpose

This service acts as:
- CI/CD pipeline test target
- Kubernetes deployment workload
- Observability integration target
- Base service for future AI agent integrations
---
