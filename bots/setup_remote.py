"""
Setup Test User - Remote Execution (Modal)
Avoids local clock skew issues by running on Modal's synchronized infrastructure.
"""
import modal

# Reuse the existing image and app definition
image = modal.Image.debian_slim(python_version="3.11").pip_install(
    "google-cloud-firestore>=2.19.0",
    "google-auth>=2.20.0"
)

app = modal.App("softfawer-setup-data", image=image)
firestore_secret = modal.Secret.from_name("firestore-credentials")

@app.function(secrets=[firestore_secret])
def seed_test_data():
    import json
    import os
    from google.cloud import firestore
    from google.oauth2 import service_account
    
    print("Initializing properly authenticated Firestore client...")
    
    # Load credentials from Environment Variable injected by Secret
    creds_json = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS_JSON")
    if not creds_json:
        raise ValueError("Secret not found!")
        
    creds_info = json.loads(creds_json)
    credentials = service_account.Credentials.from_service_account_info(creds_info)
    db = firestore.Client(credentials=credentials, project=creds_info.get("project_id"))
    
    TENANT_ID = "test_user_123"
    print(f"Setting up test tenant: {TENANT_ID}...")
    
    tenant_ref = db.collection("tenants").document(TENANT_ID)
    
    # 1. Tenant Profile
    tenant_ref.set({
        "name": "Test User (Cloud Seeded)",
        "email": "test@example.com",
        "purchased_bots": ["rules"] 
    }, merge=True)
    
    # 2. Service
    service_id = "whatsapp_rules_appointments"
    service_ref = tenant_ref.collection("services").document(service_id)
    service_ref.set({
        "type": "rules",
        "active": True,
        "settings": {
            "mode": "appointments",
            "opening_hours": "Lun-Vie 9:00-18:00 (Cloud)"
        }
    })
    
    print("✅ Success! Data created in Firestore.")

if __name__ == "__main__":
    with app.run():
        seed_test_data.remote()
