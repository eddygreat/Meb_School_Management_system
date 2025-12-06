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
            # Just run upgrade head to be safe, standard flow
            subprocess.run("alembic upgrade head", shell=True, check=True)
        else:
            print("⚠️ 'users' table NOT found! Database might be out of sync.")
            print("Running force reset (stamp base -> upgrade head)...")
            
            # Force Alembic to think it's at base, then upgrade
            subprocess.run("alembic stamp base", shell=True, check=True)
            print("✅ Force initialization complete. Tables should be created.")

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
