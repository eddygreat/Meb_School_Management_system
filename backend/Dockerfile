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

# Copy the rest of the backend application code into the container.
# The '.' means "copy everything from the current directory (the backend folder) into the container's WORKDIR".
COPY . .

# Command to run your application using Gunicorn.
# This command assumes your main FastAPI file is 'main.py' inside the 'app' folder,
# and the FastAPI instance is named 'app'. It binds to the port Render expects.
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:10000", "app.main:app"]