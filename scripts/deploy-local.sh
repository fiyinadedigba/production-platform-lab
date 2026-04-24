#!/bin/bash
set -e

IMAGE_TAG=${1:-v1.0.0}

echo "Deploying production-platform-api:$IMAGE_TAG"

helm upgrade --install production-platform-api \
  infrastructure/kubernetes/helm/production-platform-api \
  --set image.repository=ghcr.io/fiyinadedigba/production-platform-api \
  --set image.tag=$IMAGE_TAG

kubectl rollout status deployment/production-platform-api
kubectl get pods
