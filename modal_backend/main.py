import modal
from typing import Dict, Any
from fastapi import FastAPI, Request, HTTPException
import os
import json

# Define the image with necessary dependencies
# We use a slim Python image and install our requirements
image = modal.Image.debian_slim(python_version="3.10").pip_install(
    "firebase-admin",
    "requests",
    "fastapi",
    "uvicorn"
)

app = modal.App("softfawer-multi-tenant-backend", image=image)
fastapi_app = FastAPI()

# Import our common services (will be mounted)
# Note: In Modal, we need to ensure these files are available in the container.
# We will use `mounts` in the app definition or import logic tailored for Modal.
# For simplicity in this step, we assume the code is packaged or these modules are in the path.
# In a real Modal deployment, we'd wrap these classes or mount the `modal_backend` dir.

# However, for the purpose of this file acting as the entry point, we will import them relative
# assuming the file structure is preserved in the mount.
from .common.firebase_service import MultiTenantService
from .common.ark_client import ArkClient
from .handlers.ai_bot import handle_ai_bot
from .handlers.rules_bot import handle_rules_bot

# Initialize Services
# Secrets should be injected via modal.Secret
@app.function(
    secrets=[
        modal.Secret.from_name("firebase-credentials"), # Expected to have FIREBASE_SERVICE_ACCOUNT_PATH or content
        modal.Secret.from_name("ark-api-key")        # Expected to have ARK_API_KEY
    ],
    mounts=[modal.Mount.from_local_dir("modal_backend", remote_path="/root/modal_backend")]
)
@modal.asgi_app()
def fastapi_entrypoint():
    return fastapi_app

# --- FastAPI Routes ---

@fastapi_app.post("/webhook/{platform}")
async def unified_webhook(platform: str, request: Request):
    """
    Unified entry point for WhatsApp (Gateway) and Telegram.
    Query Params:
      - tenantId: ID of the client (tenant)
      - botId: ID of the specific bot config
    """
    query_params = request.query_params
    tenant_id = query_params.get("tenantId")
    bot_id = query_params.get("botId")
    
    if not tenant_id or not bot_id:
        raise HTTPException(status_code=400, detail="Missing tenantId or botId")
    
    # 1. Parse Body
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    # 2. Extract Message based on Platform
    user_text = ""
    user_phone = "" # or user ID
    
    if platform == "whatsapp":
        # Check SoftFawer Gateway format
        # Assuming: { "from": "...", "body": "...", "name": "..." }
        entry = body.get("data", {}) # Gateway might wrap it
        # Adjust based on your actual Gateway payload structure
        # fallback to direct body if not wrapped
        if not entry: entry = body
        
        user_text = entry.get("body") or entry.get("message")
        user_phone = entry.get("from")
        
    elif platform == "telegram":
        # Telegram Update Object
        message = body.get("message", {})
        user_text = message.get("text", "")
        user_phone = str(message.get("from", {}).get("id", ""))
        
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported platform: {platform}")

    if not user_text:
        return {"status": "ignored", "reason": "no_text"}

    # 3. Initialize Services
    firebase = MultiTenantService()
    ark = ArkClient() # Gets key from env (Secret)

    # 4. Fetch Config
    config = firebase.get_tenant_config(tenant_id, bot_id)
    if not config:
        return {"status": "error", "reason": "bot_not_found"}
        
    if config.get("active") is False:
        return {"status": "ignored", "reason": "bot_inactive"}

    # 5. Process Logic
    bot_type = config.get("type", "ai")
    response_text = ""
    
    # Chat ID composition (Tenant specific)
    chat_id = f"{platform}_{user_phone}"

    if bot_type == "ai":
        # Fetch Context
        history = firebase.get_chat_history(tenant_id, bot_id, chat_id, limit=10)
        
        # Run AI
        response_text = handle_ai_bot(user_text, history, config, ark)
        
    elif bot_type == "rules":
        # Run Rules Engine
        response_text = handle_rules_bot(user_text, config)
        
    # 6. Save User Msg & Bot Reply
    firebase.save_message(tenant_id, bot_id, chat_id, {
        "role": "user",
        "content": user_text,
        "timestamp": firestore.SERVER_TIMESTAMP,
        "platform": platform
    })
    
    if response_text:
        firebase.save_message(tenant_id, bot_id, chat_id, {
            "role": "assistant",
            "content": response_text,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "platform": platform
        })

    # 7. Return Response (or send async)
    # Ideally we should send this to the Gateway/Telegram API asynchronously
    # For now, we return it in the body if the gateway supports sync replies,
    # or we would need a 'SenderService' to POST back.
    
    return {
        "status": "success",
        "reply": response_text
    }
