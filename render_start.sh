#!/usr/bin/env bash
# Exit immediately if any command fails
set -o errexit

# 1. Run database migrations
# This creates the 'users' table so you don't get the "relation does not exist" error
echo "Running Database Migrations..."
alembic upgrade head

# 2. Start the server
# This launches your app using the specific command you provided earlier
echo "Starting Server..."
exec gunicorn app.main:app --bind 0.0.0.0:$PORT -k uvicorn.workers.UvicornWorker