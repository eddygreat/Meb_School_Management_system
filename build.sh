#!/usr/bin/env bash
# exit on error
set -o errexit
 
# Backend dependencies
pip install -r backend/requirements.txt
 
# Frontend build
echo "Building frontend..."
cd frontend
npm install
# Give execution permission to react-scripts
chmod +x node_modules/.bin/vite
npm run build
cd ..
 
# Copy frontend build to backend static folder
echo "Copying frontend build to backend..."
cp -a frontend/build/. backend/static/