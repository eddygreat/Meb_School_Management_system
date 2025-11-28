FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install minimal build dependencies so C-extensions (psycopg2/asyncpg) can build if needed.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       gcc \
       libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Add a healthcheck to your application
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Create a non-root user and give ownership of the app directory.
RUN useradd --create-home appuser \
    && chown -R appuser:appuser /app

USER appuser

CMD ["gunicorn", "--chdir", "app", "-c", "gunicorn_conf.py", "main:app"]
