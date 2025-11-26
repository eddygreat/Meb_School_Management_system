# Use an official Python runtime as a parent image.
FROM python:3.11-slim

# Set environment variables to prevent Python from writing .pyc files and to run in unbuffered mode.
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container.
WORKDIR /app

# Copy the requirements file into the container at /app.
# Since this Dockerfile is in the 'backend' directory, we can copy it directly.
COPY requirements.txt .

# Install the dependencies.
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code from the local 'app' directory into the container's WORKDIR ('/app').
# This ensures the structure is /app/main.py, /app/core, etc.
COPY app/ .

# Command to run your application using Gunicorn.
# Now that the structure is correct, gunicorn can find 'main:app'.
# The working directory is /app, so it looks for main.py inside it.
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:10000", "main:app"]