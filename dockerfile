# Stage 1: Build the React frontend
FROM node:20-alpine as frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./

RUN npm run build

# Stage 2: Build the Python backend
FROM python:3.11-slim

# Set environment variables for Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies required for health checks and building Python packages
RUN apt-get update && apt-get install -y --no-install-recommends curl build-essential libpq-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy requirements file and install dependencies first to leverage Docker cache
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the built frontend assets and the backend application code
COPY --from=frontend-builder /app/frontend/dist ./static
COPY backend/app ./app

# Create and switch to a non-root user for security
RUN useradd --create-home appuser
USER appuser

# Health check to ensure the application is running before accepting traffic
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api/healthcheck || exit 1

# Use Gunicorn to run Uvicorn workers for a more robust production server.
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-c", "app/gunicorn_conf.py", "app.main:app"]