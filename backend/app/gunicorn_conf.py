# Gunicorn configuration file

import os
import multiprocessing

# Server socket
# Bind to 0.0.0.0 to allow external connections (e.g., from Docker's host)
# The port is set from an environment variable, defaulting to 8080.
bind = f"0.0.0.0:{os.getenv('PORT', '8080')} --timeout 120"

# Worker processes
# A common recommendation is (2 * number_of_cores) + 1.
# This can be adjusted based on application performance.
workers = multiprocessing.cpu_count() * 2 + 1

# The type of worker class to use. UvicornWorker allows Gunicorn to manage Uvicorn.
worker_class = "uvicorn.workers.UvicornWorker"

# Logging
accesslog = "-"  # Log access to stdout
errorlog = "-"   # Log errors to stdout