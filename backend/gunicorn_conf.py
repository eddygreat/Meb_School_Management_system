import os

# Gunicorn configuration file
import multiprocessing

# Bind to 0.0.0.0:$PORT or default to 10000
port = os.getenv("PORT", "10000")
bind = f"0.0.0.0:{port}"

# Worker Options
# workers = multiprocessing.cpu_count() * 2 + 1
workers = 2  # Start with 2 workers for free tier to save memory
worker_class = "uvicorn.workers.UvicornWorker"

# Timeout Options
timeout = 120  # workers silent for more than this many seconds are killed and restarted
keepalive = 5

# Logging Options
accesslog = "-"  # print request logs to stdout
errorlog = "-"   # print error logs to stderr
loglevel = "info"

# Process Naming
proc_name = "meb-school-backend"
