"""
Setup Test User for End-to-End Integration
"""
import json
from google.cloud import firestore
from google.oauth2 import service_account

# Load credentials
with open("../firebase-service-account.json", "r") as f:
    creds_info = json.load(f)

credentials = service_account.Credentials.from_service_account_info(creds_info)
db = firestore.Client(credentials=credentials, project=creds_info.get("project_id"))

TENANT_ID = "test_user_123"

def setup_test_data():
    print(f"Setting up test tenant: {TENANT_ID}...")
    
    tenant_ref = db.collection("tenants").document(TENANT_ID)
    
    # 1. Tenant Profile + Purchases
    tenant_ref.set({
        "name": "Test User",
        "email": "test@example.com",
        "purchased_bots": ["rules"] # Necessary for Marketplace check
    }, merge=True)
    
    # 2. Service Configuration
    # ID: whatsapp_rules_appointments
    service_id = "whatsapp_rules_appointments"
    service_ref = tenant_ref.collection("services").document(service_id)
    
    service_ref.set({
        "type": "rules",
        "active": True, # User said 'enabled: true', mapping to active
        "settings": {
            "mode": "appointments",
            "opening_hours": "Lun-Vie 9:00-18:00"
        }
    })
    
    print("✅ Test data created successfully!")
    print(f"Tenant: {TENANT_ID}")
    print(f"Service: {service_id} (Rules Bot / Appointments Mode)")

if __name__ == "__main__":
    setup_test_data()
