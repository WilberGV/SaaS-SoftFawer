"""
Create SoftFawer Secrets in Modal
"""
import modal
import os
import subprocess
import sys

# Values retrieved from configuration
PROJECT_ID = "softfawer"
GATEWAY_API_KEY = "softfawer_secret_key_2026_safe"
# Placeholder for Gateway URL - User needs to update this with real IP/Domain later
GATEWAY_URL = "http://YOUR_PUBLIC_IP:3001" 

print("Creating softfawer-secrets...")

result = subprocess.run([
    sys.executable, "-m", "modal", "secret", "create", 
    "softfawer-secrets",
    f"FIREBASE_PROJECT_ID={PROJECT_ID}",
    f"GATEWAY_URL={GATEWAY_URL}",
    f"GATEWAY_API_KEY={GATEWAY_API_KEY}"
], capture_output=True, text=True, encoding="utf-8")

if result.returncode == 0:
    print("Secret 'softfawer-secrets' created successfully.")
else:
    print(f"Error creating secret: {result.stderr}")
