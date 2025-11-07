# Stage 1: Build the React frontend
FROM node:20-alpine as frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN CI=false npm run build

# Stage 2: Build the Python backend
FROM python:3.11-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --from=frontend-builder /app/frontend/build ./backend/static
COPY backend/ ./backend/

WORKDIR /app/backend

EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]