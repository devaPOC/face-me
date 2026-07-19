#!/bin/bash

# Exit on error
set -e

echo "copying .env"
cp ../.env.backend ./backend/.env

echo "🚀 Starting FaceMe backend deployment..."

# 1. Pull the latest code
echo "📥 Pulling latest changes from Git..."
git pull

# 2. Build and restart containers using Docker Compose
echo "📦 Rebuilding and starting the backend container..."
docker compose up -d --build backend

# 3. Clean up dangling/old images to save disk space
echo "🧹 Cleaning up unused Docker images..."
docker image prune -f

echo "✅ Backend deployed successfully! Running containers:"
docker compose ps
