import os
import subprocess
import sys

def main():
    # 1. Run Database Migrations
    print("--- Running Database Migrations ---")
    try:
        # Run alembic upgrade head
        subprocess.run(["alembic", "upgrade", "head"], check=True)
        print("--- Migrations Successful ---")
    except subprocess.CalledProcessError as e:
        print(f"!!! Migration Failed: {e} !!!")
        # We allow the server to try starting anyway, so you can see the logs
        
    # 2. Start the Application
    print("--- Starting Gunicorn Server ---")
    port = os.environ.get("PORT", "10000")
    
    # This command replaces the python process with the gunicorn server
    # It mimics: gunicorn app.main:app --bind 0.0.0.0:$PORT -k uvicorn.workers.UvicornWorker
    os.execlp(
        "gunicorn", 
        "gunicorn", 
        "app.main:app", 
        "--bind", f"0.0.0.0:{port}", 
        "-k", "uvicorn.workers.UvicornWorker"
    )

if __name__ == "__main__":
    main()