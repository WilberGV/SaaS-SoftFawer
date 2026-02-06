"""
Setup Marketplace Tenant
Seeds Firestore with a tenant that has 'purchased' the DeepSeek bot.
"""

import json
from google.cloud import firestore
from google.oauth2 import service_account

# Load credentials locally
with open("../firebase-service-account.json", "r") as f:
    creds_info = json.load(f)

credentials = service_account.Credentials.from_service_account_info(creds_info)
db = firestore.Client(credentials=credentials, project=creds_info.get("project_id"))

TENANT_ID = "deepseek-demo" # Using the same ID as local test

def setup_marketplace():
    print(f"Configuring Marketplace for tenant '{TENANT_ID}'...")
    
    tenant_ref = db.collection("tenants").document(TENANT_ID)
    
    # GRANT ACCESS via purchased_bots
    tenant_ref.set({
        "purchased_bots": ["deepseek", "rules", "ai"], # Grant access to all for demo
        "name": "Demo User"
    }, merge=True)
    
    # Configure services
    services_ref = tenant_ref.collection("services")
    
    # AI Bot
    services_ref.document("my-ai-bot").set({
        "type": "ai",
        "name": "IA Básica",
        "active": True,
        "settings": {"business_name": "Demo Corp"}
    })
    
    # DeepSeek Bot
    services_ref.document("my-deepseek").set({
        "type": "deepseek",
        "name": "Sofía Avanzada",
        "active": True
    })
    
    print("✅ Tenant configured with 'deepseek' purchase.")
    print("Service 'my-ai-bot' created.")

if __name__ == "__main__":
    setup_marketplace()
