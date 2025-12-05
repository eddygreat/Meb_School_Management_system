import subprocess
import os
import sys

# Define the corrected DATABASE_URL
# Removing &channel_binding=require which causes asyncpg issues
# Note: alembic uses psycopg2 usually, but the project might be configured for asyncpg in env.py
# Let's check env.py first? No, let's just try to set the env var to a standard postgresql:// url if possible,
# or just the cleaned asyncpg one if alembic is async.
# Based on reset_db.py failure, the URL in .env has &channel_binding=require.

# Let's read the current .env to get the base URL
from dotenv import load_dotenv
load_dotenv()

current_url = os.getenv("DATABASE_URL")
if not current_url:
    print("DATABASE_URL not found in .env")
    sys.exit(1)

# Clean the URL
clean_url = current_url.replace("&channel_binding=require", "")
print(f"Using cleaned URL: {clean_url.split('@')[1] if '@' in clean_url else 'REDACTED'}")

# Set environment variable for the subprocess
env = os.environ.copy()
env["DATABASE_URL"] = clean_url

# Run alembic downgrade base
print("Running 'alembic downgrade base'...")
try:
    # We need to run this from the backend directory
    # Assuming this script is in backend/
    subprocess.run(["venv\\Scripts\\alembic.exe", "downgrade", "base"], check=True, env=env, shell=True)
    print("Downgrade complete. Database should be empty.")
    
    # Run alembic upgrade head
    print("Running 'alembic upgrade head'...")
    subprocess.run(["venv\\Scripts\\alembic.exe", "upgrade", "head"], check=True, env=env, shell=True)
    print("Upgrade complete. Tables recreated.")
    
except subprocess.CalledProcessError as e:
    print(f"Error running alembic: {e}")
    sys.exit(1)
