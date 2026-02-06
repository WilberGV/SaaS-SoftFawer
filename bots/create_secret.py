"""Helper script to create Modal secret from Firebase service account JSON"""
import modal
import json

# Read the service account JSON
with open("../firebase-service-account.json", "r") as f:
    service_account_json = f.read()

# Create the secret
secret = modal.Secret.from_dict({
    "GOOGLE_APPLICATION_CREDENTIALS_JSON": service_account_json
})

print("Secret object created successfully!")
print("To use in Modal, reference: modal.Secret.from_name('firestore-credentials')")
print("\nNow creating secret in Modal...")

# Use Modal CLI to create secret
import subprocess
import sys

# Escape the JSON for command line
escaped_json = service_account_json.replace('"', '\\"')

result = subprocess.run([
    sys.executable, "-m", "modal", "secret", "create", 
    "firestore-credentials",
    f"GOOGLE_APPLICATION_CREDENTIALS_JSON={service_account_json}"
], capture_output=True, text=True)

if result.returncode == 0:
    print("✓ Secret created successfully!")
else:
    print(f"Error: {result.stderr}")
    print("\nTrying alternative method...")
    
    # Alternative: use environment variable method
    import os
    os.environ["FIREBASE_CREDS"] = service_account_json
    
    result2 = subprocess.run([
        sys.executable, "-m", "modal", "secret", "create",
        "firestore-credentials", 
        'GOOGLE_APPLICATION_CREDENTIALS_JSON=$FIREBASE_CREDS'
    ], capture_output=True, text=True, shell=True)
    
    if result2.returncode == 0:
        print("✓ Secret created with alternative method!")
    else:
        print(f"Alternative also failed: {result2.stderr}")
        print("\nPlease create the secret manually via Modal web dashboard:")
        print("1. Go to https://modal.com/secrets")
        print("2. Create new secret named 'firestore-credentials'")
        print("3. Add key: GOOGLE_APPLICATION_CREDENTIALS_JSON")
        print("4. Paste the contents of firebase-service-account.json as value")
