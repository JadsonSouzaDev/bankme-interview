# Deploy Pipeline Setup

This document explains how to configure the backend deploy pipeline using GitHub Actions.

## Prerequisites

1. **Google Cloud Platform (GCP)** configured with:
   - Artifact Registry enabled
   - Google Kubernetes Engine (GKE) configured
   - Service Account with adequate permissions

2. **GitHub Repository** with Actions enabled

## Secrets Configuration

Configure the following secrets in your GitHub repository (`Settings > Secrets and variables > Actions`):

### GCP_SA_KEY
JSON key from Google Cloud Service Account with the following permissions:
- `Artifact Registry Writer`
- `Kubernetes Engine Developer`
- `Container Registry Service Agent`

### GCP_PROJECT_ID
Project ID in Google Cloud Platform

### GCP_REGION
Region where resources are located (e.g., `us-central1`, `southamerica-east1`)

### GCP_ARTIFACT_REGISTRY
Repository name in Artifact Registry (e.g., `bankme-images`)

### GKE_CLUSTER_NAME
GKE cluster name

### GKE_NAMESPACE
Namespace where the deployment is running (e.g., `default`)

## How to Use the Pipeline

1. Go to the **Actions** tab in your GitHub repository
2. Select the **Deploy Backend** workflow
3. Click **Run workflow**
4. Enter the desired tag (e.g., `v1.0.0`, `latest`)
5. Click **Run workflow**

## Pipeline Structure

The pipeline is divided into 3 jobs:

### 1. test-and-build
- Installs dependencies
- Runs unit and e2e tests
- Builds the application

### 2. build-and-push-image
- Builds the Docker image
- Pushes to GCP Artifact Registry

### 3. deploy-to-gke
- Updates the deployment in GKE
- Waits for rollout to complete
- Verifies pod status

## Troubleshooting

### Authentication error
Check if `GCP_SA_KEY` is correct and if the Service Account has the necessary permissions.

### Build error
Check if the Dockerfile is correct and if all dependencies are installed.

### Deploy error
Check if:
- The GKE cluster exists and is accessible
- The `bankme-backend` deployment exists in the specified namespace
- The Service Account has permissions for GKE

## Deployment YAML Example

If you don't have a deployment in GKE yet, here's an example:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bankme-backend
  namespace: default
spec:
  replicas: 2
  selector:
    matchLabels:
      app: bankme-backend
  template:
    metadata:
      labels:
        app: bankme-backend
    spec:
      containers:
      - name: bankme-backend
        image: REGION-docker.pkg.dev/PROJECT_ID/ARTIFACT_REGISTRY/bankme-backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: bankme-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: bankme-secrets
              key: jwt-secret
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: bankme-secrets
              key: redis-url
        - name: ALLOWED_ORIGINS
          value: "http://localhost:3000"
---
apiVersion: v1
kind: Service
metadata:
  name: bankme-backend-service
  namespace: default
spec:
  selector:
    app: bankme-backend
  ports:
  - port: 80
    targetPort: 3001
  type: LoadBalancer
``` 