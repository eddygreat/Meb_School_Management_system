#!/usr/bin/env bash
# exit on error
set -o errexit
 
# Backend dependencies
pip install -r backend/requirements.txt
 
# Frontend build
echo "Building frontend..."
cd frontend
npm install
# Grant execute permissions to the .bin directory
chmod -R +x node_modules/.bin/
npm run build
cd ..
 
# Copy frontend build to backend static folder
echo "Copying frontend build to backend..."
cp -a frontend/build/. backend/static/