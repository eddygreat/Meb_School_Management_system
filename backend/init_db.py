import os
import psycopg2
import subprocess
import sys

def init_db():
    print("Starting database initialization check...")
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found")
        sys.exit(1)

    # Handle asyncpg URL format if present
    if "+asyncpg" in db_url:
        db_url = db_url.replace("+asyncpg", "+psycopg2")

    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # Check connection info
        cur.execute("SELECT current_database(), current_user, inet_server_addr()")
        db_info = cur.fetchone()
        print(f"🔌 init_db connected to: DB={db_info[0]}, User={db_info[1]}, IP={db_info[2]}")

        # Check if users table exists
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            );
        """)
        exists = cur.fetchone()[0]
        
        cur.close()
        conn.close()

        if exists:
            print("✅ 'users' table found. Standard migration verification...")
            # Run upgrade head with capture
            try:
                result = subprocess.run("alembic upgrade head", shell=True, capture_output=True, text=True)
                print("--- Alembic Upgrade Output ---")
                print(result.stdout)
                print(result.stderr)
                if result.returncode != 0:
                    print(f"❌ Alembic upgrade failed with code {result.returncode}")
                    sys.exit(1)
            except Exception as e:
                print(f"❌ Failed to run alembic upgrade: {e}")
                sys.exit(1)
        else:
            print("⚠️ 'users' table NOT found! Database might be out of sync.")
            print("Running force reset (stamp base -> upgrade head)...")
            
            try:
                # Stamp base
                print("Running: alembic stamp base")
                res_stamp = subprocess.run("alembic stamp base", shell=True, capture_output=True, text=True)
                print(res_stamp.stdout)
                print(res_stamp.stderr)
                if res_stamp.returncode != 0:
                     print(f"❌ Alembic stamp failed: {res_stamp.stderr}")
                     sys.exit(1)

                # Upgrade head
                print("Running: alembic upgrade head")
                res_up = subprocess.run("alembic upgrade head", shell=True, capture_output=True, text=True)
                print(res_up.stdout)
                print(res_up.stderr)
                if res_up.returncode != 0:
                     print(f"❌ Alembic upgrade failed: {res_up.stderr}")
                     sys.exit(1)
                     
                print("✅ Force initialization complete. Tables should be created.")
            except Exception as e:
                print(f"❌ Failed to run alembic commands: {e}")
                sys.exit(1)

        # Final Verification
        cur = conn.cursor()
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        final_tables = [r[0] for r in cur.fetchall()]
        print(f"🔎 Final check from init_db: {final_tables}")
        if 'users' not in final_tables:
            print("🚨 CRITICAL: 'users' table STILL MISSING after upgrade!")
            sys.exit(1)
        else:
            print("✅ 'users' table confirmed present.")
        
        cur.close()
        conn.close()

    except Exception as e:
        print(f"❌ Error during manual DB check/init: {e}")
        # Identify if we need to fall back or just crash
        sys.exit(1)

if __name__ == "__main__":
    init_db()
