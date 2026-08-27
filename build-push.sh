#!/bin/bash

# ตั้งค่า Docker Hub Username ของคุณ
DOCKER_USER="your-dockerhub-username"

echo "=== 1. Logging in to Docker Hub ==="
docker login

echo "=== 2. Building Backend Image ==="
docker build -t $DOCKER_USER/e-utilities-cost-backend:latest ./backend

echo "=== 3. Building Frontend Image ==="
docker build -t $DOCKER_USER/e-utilities-cost-frontend:latest ./frontend

echo "=== 4. Pushing Images to Docker Hub ==="
docker push $DOCKER_USER/e-utilities-cost-backend:latest
docker push $DOCKER_USER/e-utilities-cost-frontend:latest

echo "=== Completed! Images pushed successfully ==="