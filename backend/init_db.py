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

    # Handle asyncpg/psycopg2 URL format for raw psycopg2 connection
    # psycopg2.connect expects 'postgresql://' not 'postgresql+psycopg2://'
    if "+asyncpg" in db_url:
        db_url = db_url.replace("+asyncpg", "")
    if "+psycopg2" in db_url:
        db_url = db_url.replace("+psycopg2", "")

    # Determine project root (where init_db.py and alembic.ini are located)
    project_root = os.path.dirname(os.path.abspath(__file__))
    print(f"DEBUG: init_db running from calculated root: {project_root}")

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
            result = subprocess.run("alembic upgrade head", shell=True, capture_output=True, text=True, cwd=project_root)
            print("--- Alembic Upgrade Output ---")
            print(result.stdout)
            print(result.stderr)
            if result.returncode != 0:
                raise Exception(f"Alembic upgrade failed with code {result.returncode}")

        else:
            print("⚠️ 'users' table NOT found! Database might be out of sync.")
            print("Running force reset (stamp base -> upgrade head)...")
            
            # DROP EXISTING TYPES to prevent "already exists" error during migration
            # This handles cases where a previous partial run created the type but not the table
            try:
                conn_clean = psycopg2.connect(db_url)
                conn_clean.autocommit = True
                cur_clean = conn_clean.cursor()
                print("Cleaning up potential leftover types...")
                cur_clean.execute("DROP TYPE IF EXISTS userrole CASCADE;")
                print("✅ Dropped type 'userrole' (if it existed).")
                cur_clean.close()
                conn_clean.close()
            except Exception as e:
                print(f"⚠️ Warning during type cleanup: {e}")

            # Stamp base
            print("Running: alembic stamp base")
            res_stamp = subprocess.run("alembic stamp base", shell=True, capture_output=True, text=True, cwd=project_root)
            print(res_stamp.stdout)
            print(res_stamp.stderr)
            if res_stamp.returncode != 0:
                 raise Exception(f"Alembic stamp failed: {res_stamp.stderr}")

            # Upgrade head
            print("Running: alembic upgrade head")
            res_up = subprocess.run("alembic upgrade head", shell=True, capture_output=True, text=True, cwd=project_root)
            print(res_up.stdout)
            print(res_up.stderr)
            if res_up.returncode != 0:
                 raise Exception(f"Alembic upgrade failed: {res_up.stderr}")
                 
            print("✅ Force initialization complete. Tables should be created.")

        # Final Verification
        try:
            conn_final = psycopg2.connect(db_url)
            cur_final = conn_final.cursor()
            cur_final.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
            final_tables = [r[0] for r in cur_final.fetchall()]
            print(f"🔎 Final check from init_db: {final_tables}")
            
            if 'users' not in final_tables:
                print("❌ CRITICAL: 'users' table STILL MISSING after upgrade!")
                sys.exit(1)
            else:
                print("✅ 'users' table confirmed present.")
            
            cur_final.close()
            conn_final.close()
        except Exception as e:
            print(f"⚠️ Error during final verification: {e}")

    except Exception as e:
        print(f"❌ Error during manual DB check/init: {e}")
        # raise e  # Don't crash the container if init fails, let the app try.
        # But for debugging, maybe we want to see it.
        pass

if __name__ == "__main__":
    try:
        init_db()
    except Exception:
        sys.exit(1)
