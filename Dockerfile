# Stage 1: Build the React frontend
FROM node:20-alpine as frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./

# Grant execute permissions to the .bin directory before building
RUN chmod -R +x node_modules/.bin/
RUN CI=false npm run build

# Stage 2: Build the Python backend
FROM python:3.11-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    # Clean up apt-get lists to reduce image size
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the built frontend assets to the /app/static directory.
COPY --from=frontend-builder /app/frontend/dist ./static
# Copy the backend application code directly into the /app directory.
COPY backend/app ./app

# Create and switch to a non-root user for security
RUN useradd --create-home appuser
USER appuser

EXPOSE 8080

# Health check to ensure the application is running before accepting traffic
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]