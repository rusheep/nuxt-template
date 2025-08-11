# 🚀 Deployment Guide

## Overview

This guide covers different deployment strategies for the Modern Admin Template.

## Prerequisites

- Node.js 18+ 
- pnpm 8+
- Git

## Build Process

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Deployment Options

### 1. Static Site Deployment (Netlify, Vercel)

The application can be deployed as a static site:

```bash
# Generate static files
pnpm generate

# The ./output/public directory contains the static files
```

**Netlify:**
1. Connect your GitHub repository
2. Set build command: `pnpm build`
3. Set publish directory: `apps/admin/.output/public`

**Vercel:**
1. Import project from GitHub
2. Framework preset will be detected automatically
3. Deploy

### 2. Node.js Server Deployment

For server-side rendering:

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

**Environment Variables:**
Create `.env` file based on `.env.example`:

```bash
API_BASE_URL=https://your-api.com/api
API_SECRET=your-production-secret
JWT_SECRET=your-jwt-secret
```

### 3. Docker Deployment

Create `Dockerfile` in the project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package*.json pnpm-workspace.yaml ./
COPY apps/admin/package*.json ./apps/admin/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start application
CMD ["pnpm", "start"]
```

Build and run:

```bash
docker build -t modern-admin-template .
docker run -p 3000:3000 modern-admin-template
```

### 4. Kubernetes Deployment

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: admin-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: admin-app
  template:
    metadata:
      labels:
        app: admin-app
    spec:
      containers:
      - name: admin-app
        image: your-registry/modern-admin-template:latest
        ports:
        - containerPort: 3000
        env:
        - name: API_BASE_URL
          value: "https://your-api.com/api"
---
apiVersion: v1
kind: Service
metadata:
  name: admin-service
spec:
  selector:
    app: admin-app
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

## Performance Optimization

### 1. Enable Gzip Compression

Configure your web server to enable gzip compression for static assets.

### 2. CDN Setup

Use a CDN for static assets to improve loading times globally.

### 3. Caching Strategy

- Static assets: 1 year cache
- HTML files: No cache or short cache
- API responses: Appropriate cache based on data freshness

## Monitoring

### Health Checks

The application exposes health check endpoints:
- `/api/health` - Basic health check
- `/api/ready` - Readiness check

### Error Tracking

Consider integrating error tracking services:
- Sentry
- Bugsnag  
- LogRocket

## Security Considerations

1. **HTTPS Only**: Always serve over HTTPS in production
2. **Environment Variables**: Never commit secrets to version control
3. **CORS Configuration**: Configure CORS properly for your domain
4. **CSP Headers**: Implement Content Security Policy headers
5. **Rate Limiting**: Implement rate limiting for API endpoints

## Rollback Strategy

Always maintain a rollback strategy:
1. Keep previous deployment artifacts
2. Use blue-green deployment for zero downtime
3. Implement feature flags for quick rollbacks