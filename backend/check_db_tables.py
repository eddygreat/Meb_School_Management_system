import os
import psycopg2
from urllib.parse import urlparse

def check_tables():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found")
        return

    # Handle asyncpg URL format if present
    if "+asyncpg" in db_url:
        db_url = db_url.replace("+asyncpg", "+psycopg2")

    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        
        tables = cur.fetchall()
        print("\n--- DATABASE TABLES ---")
        if not tables:
            print("NO TABLES FOUND!")
        else:
            for table in tables:
                print(f"- {table[0]}")
        print("-----------------------\n")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"Error checking tables: {e}")

if __name__ == "__main__":
    check_tables()
