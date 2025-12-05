import os
import subprocess
import sys

# 1. Run Database Migrations
print("--- Running Database Migrations ---")
try:
    subprocess.run(["alembic", "upgrade", "head"], check=True)
except subprocess.CalledProcessError:
    print("Migration failed. Check your database connection.")
    sys.exit(1)

# 2. Start the Gunicorn Server
print("--- Starting Server ---")
port = os.environ.get("PORT", "10000")
command = [
    "gunicorn",
    "app.main:app",
    "--bind", f"0.0.0.0:{port}",
    "-k", "uvicorn.workers.UvicornWorker"
]

# This replaces the current process with Gunicorn (no shell needed)
os.execvp("gunicorn", command)