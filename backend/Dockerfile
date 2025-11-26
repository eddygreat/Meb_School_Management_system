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

# Copy the entire backend directory contents (including the 'app' folder) into the container's WORKDIR.
# This creates the correct /app/app structure that your absolute imports expect.
COPY . .

# Command to run your application using Gunicorn.
# Gunicorn needs to be told where to find the application module.
# Since the code is now in /app/app/main.py, the correct module path is 'app.main:app'.
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:10000", "app.main:app"]