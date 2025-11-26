# Use an official Python runtime as a parent image.
FROM python:3.11-slim

# Set environment variables to prevent Python from writing .pyc files and to run in unbuffered mode.
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container.
WORKDIR /app

# Copy the requirements file into the container at /app.
COPY requirements.txt .

# Install the dependencies.
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend application code into the container.
COPY . .

# Create and switch to a non-root user for security
RUN addgroup --system app && adduser --system --ingroup app appuser
RUN chown -R appuser:app /app
USER appuser

# Command to run your application using Gunicorn.
# We use the configuration file for a cleaner setup.
CMD ["gunicorn", "-c", "app/gunicorn_conf.py", "app.main:app"]