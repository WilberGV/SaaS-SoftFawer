"""
Setup Demo Tenant in Firestore
Creates a tenant configuration with all bot types available for testing.
"""

import json
import os
from google.cloud import firestore
from google.oauth2 import service_account

# Load credentials locally
with open("../firebase-service-account.json", "r") as f:
    creds_info = json.load(f)

credentials = service_account.Credentials.from_service_account_info(creds_info)
db = firestore.Client(credentials=credentials, project=creds_info.get("project_id"))

TENANT_ID = "demo"
PHONE_NUMBER = "5491155551234"  # Mock phone number for testing

def setup_tenant():
    print(f"Setting up tenant '{TENANT_ID}'...")
    
    tenant_ref = db.collection("tenants").document(TENANT_ID)
    services_ref = tenant_ref.collection("services")
    
    # 1. Scheduling Bot
    print("- Creating 'scheduling-bot' service...")
    services_ref.document("scheduling-bot").set({
        "type": "scheduling",
        "name": "Asistente de Citas",
        "active": True,
        "settings": {
            "business_name": "Clínica Dental SoftFawer",
            "services": ["Limpieza Dental", "Consulta General", "Ortodoncia", "Blanqueamiento"],
            "support_hours": "Lunes a Viernes 9-18hs"
        }
    })
    
    # 2. FAQ Bot
    print("- Creating 'faq-bot' service...")
    services_ref.document("faq-bot").set({
        "type": "faq",
        "name": "Soporte FAQ",
        "active": True,
        "settings": {
            "business_name": "Tienda SoftFawer",
            "ai_enabled": False,  # Fallback to rules if no OpenAI key
            "knowledge_base": {
                "envios": {
                    "keywords": ["envio", "entregar", "tiempo", "demora"],
                    "answer": "Realizamos envíos a todo el país. El tiempo estimado es de 3 a 5 días hábiles."
                },
                "devoluciones": {
                    "keywords": ["devolver", "cambio", "garantia"],
                    "answer": "Tienes 30 días para realizar cambios o devoluciones presentando tu ticket de compra."
                }
            }
        }
    })
    
    # 3. Lead Bot
    print("- Creating 'lead-bot' service...")
    services_ref.document("lead-bot").set({
        "type": "lead",
        "name": "Calificador de Leads",
        "active": True,
        "settings": {
            "business_name": "Consultoría Tech"
        }
    })
    
    # 4. Notification Bot
    print("- Creating 'notification-bot' service...")
    services_ref.document("notification-bot").set({
        "type": "notification",
        "name": "Notificaciones",
        "active": True,
        "settings": {
            "business_name": "Logística Express"
        }
    })

    print("\n✓ Tenant setup complete!")
    print(f"Tenant ID: {TENANT_ID}")
    print("Services created: scheduling-bot, faq-bot, lead-bot, notification-bot")

if __name__ == "__main__":
    setup_tenant()
