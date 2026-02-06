"""
SoftFawer Bots Router - Modal App
Production-ready multi-tenant bot engine with Firestore integration
"""

import modal
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

# Modal image configuration
image = modal.Image.debian_slim(python_version="3.11").pip_install(
    "fastapi>=0.115.0",
    "google-cloud-firestore>=2.19.0",
    "httpx>=0.28.0",
    "pydantic>=2.10.0",
    "openai>=1.50.0",
    "google-api-python-client>=2.100.0"
).add_local_dir("handlers", remote_path="/root/handlers")

app = modal.App(name="softfawer-bots", image=image)

# Modal Secrets (Firestore is mandatory)
firestore_secret = modal.Secret.from_name("firestore-credentials")
deepseek_secret = modal.Secret.from_name("deepseek-secret")
softfawer_secret = modal.Secret.from_name("softfawer-secrets")
secrets = [firestore_secret, deepseek_secret, softfawer_secret]

# --- Models ---
class IncomingEvent(BaseModel):
    """Incoming message event from WhatsApp Gateway"""
    tenantId: str = Field(..., description="Tenant identifier")
    serviceId: str = Field(..., description="Service/bot identifier")
    from_: str = Field(..., alias="from", description="Sender phone number")
    text: str = Field(..., description="Message text")
    timestamp: int = Field(..., description="Unix timestamp")
    messageId: Optional[str] = Field(None, description="Original message ID")

class BotResponse(BaseModel):
    """Response from bot handler"""
    success: bool
    reply_text: Optional[str] = None
    tenantId: str
    serviceId: str
    to: str
    meta: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

# --- Firestore Helper ---
def get_firestore_client():
    import json
    import os
    from google.cloud import firestore
    from google.oauth2 import service_account
    
    creds_json = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS_JSON")
    if not creds_json:
        raise ValueError("GOOGLE_APPLICATION_CREDENTIALS_JSON not set")
    
    creds_info = json.loads(creds_json)
    credentials = service_account.Credentials.from_service_account_info(creds_info)
    return firestore.Client(credentials=credentials, project=creds_info.get("project_id"))

def check_permission(db, tenant_id: str, service_type: str) -> bool:
    """Verify tenant has purchased/enabled this bot type."""
    try:
        tenant_doc = db.collection("tenants").document(tenant_id).get()
        if not tenant_doc.exists:
            return False
            
        data = tenant_doc.to_dict()
        purchased = data.get("purchased_bots", [])
        
        if service_type == "rules": # Basic bot is free
            return True
            
        return service_type in purchased
    except Exception as e:
        print(f"Permission check error: {e}")
        return False

# --- Router Endpoint ---
@app.function(secrets=secrets, timeout=60)
@modal.fastapi_endpoint(method="POST")
async def handle_event(event: IncomingEvent) -> BotResponse:
    import sys
    sys.path.insert(0, "/root") # Ensure imports work in Modal
    
    try:
        db = get_firestore_client()
        
        # 1. Fetch Service Config
        service_ref = db.collection("tenants").document(event.tenantId)\
                        .collection("services").document(event.serviceId)
        service_doc = service_ref.get()
        
        if not service_doc.exists:
            return BotResponse(
                success=False, tenantId=event.tenantId, serviceId=event.serviceId, to=event.from_,
                error=f"Service {event.serviceId} not found"
            )
            
        service_config = service_doc.to_dict()
        service_type = service_config.get("type", "rules")
        
        # 2. Marketplace Permission Check
        if not check_permission(db, event.tenantId, service_type):
            return BotResponse(
                success=False, tenantId=event.tenantId, serviceId=event.serviceId, to=event.from_,
                reply_text="⛔ Bot no activo en su plan.",
                error="Access Denied"
            )
            
        # 3. Dispatch Logic
        if service_type == "ai":
            from handlers.ai_bot_handler import handle_ai_bot
            result = await handle_ai_bot(event, service_config, db)
            
        elif service_type == "rules":
            from handlers.rules_bot_handler import handle_rule_bot
            result = await handle_rule_bot(event, service_config, db)
            
        elif service_type == "deepseek":
            from handlers.deepseek_handler import handle_deepseek_bot
            result = await handle_deepseek_bot(event, service_config, db)
            
        # ... Add other types (scheduling, faq, etc) as needed ...
        
        else:
             return BotResponse(
                success=False, tenantId=event.tenantId, serviceId=event.serviceId, to=event.from_,
                error=f"Unknown type: {service_type}"
            )
            
        return BotResponse(
            success=True,
            reply_text=result.get("reply_text"),
            tenantId=event.tenantId,
            serviceId=event.serviceId,
            to=event.from_,
            meta=result.get("meta")
        )

    except Exception as e:
        import traceback
        return BotResponse(
            success=False, tenantId=event.tenantId, serviceId=event.serviceId, to=event.from_,
            error=f"{str(e)}\n{traceback.format_exc()}"
        )

@app.function(secrets=secrets)
@modal.fastapi_endpoint(method="GET")
async def health():
    return {"status": "ok", "version": "3.0.0"}
