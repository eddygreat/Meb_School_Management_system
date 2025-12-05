import requests
import json
import sys

BASE_URL = "http://localhost:8000/api"

def test_auth():
    print("--- Testing Authentication Flow ---")
    
    # 1. Register
    email = "test_user_123@example.com"
    password = "password123"
    
    register_payload = {
        "email": email,
        "password": password,
        "role": "student",
        "full_name": "Test User"
    }
    
    print(f"\n1. Registering user: {email}...")
    try:
        # Note: If user already exists, this might fail with 400. 
        # We'll handle that.
        resp = requests.post(f"{BASE_URL}/auth/register", json=register_payload)
        
        if resp.status_code == 201 or resp.status_code == 200:
            print("Registration successful!")
            print(resp.json())
        elif resp.status_code == 400 and "already registered" in resp.text:
            print("User already registered. Proceeding to login.")
        else:
            print(f"Registration failed: {resp.status_code} - {resp.text}")
            # If registration fails (other than already exists), we might stop here
            # but let's try login anyway just in case.
            
    except Exception as e:
        print(f"Error during registration: {e}")
        return

    # 2. Login
    print(f"\n2. Logging in user: {email}...")
    login_payload = {
        "username": email, # OAuth2PasswordRequestForm expects 'username' usually, but let's check what the backend expects. 
                           # Based on Signup.jsx it sends {email, password} but AuthContext sends 'credentials'.
                           # Standard FastAPI OAuth2 uses form data with 'username' and 'password'.
                           # Let's try JSON first as per Signup.jsx implication, then Form data if that fails.
        "email": email,
        "password": password
    }
    
    try:
        # Trying JSON first as implied by frontend code
        resp = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
        
        if resp.status_code == 200:
            print("Login successful!")
            data = resp.json()
            print(f"Token received: {data.get('access_token')[:20]}...")
        else:
            print(f"Login (JSON) failed: {resp.status_code} - {resp.text}")
            
            # Fallback: Try Form Data (standard FastAPI OAuth2)
            print("Retrying with Form Data...")
            form_data = {
                "username": email,
                "password": password
            }
            resp = requests.post(f"{BASE_URL}/auth/login", data=form_data)
            if resp.status_code == 200:
                print("Login (Form Data) successful!")
                data = resp.json()
                print(f"Token received: {data.get('access_token')[:20]}...")
            else:
                print(f"Login (Form Data) failed: {resp.status_code} - {resp.text}")

    except Exception as e:
        print(f"Error during login: {e}")

if __name__ == "__main__":
    test_auth()
