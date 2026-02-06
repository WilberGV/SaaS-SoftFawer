import firebase_admin
from firebase_admin import credentials, firestore
from typing import Dict, Any, Optional
import os
import logging

# Initialize Firebase Admin if not already initialized
if not firebase_admin._apps:
    # Assuming credential file path is set in env or using default service account
    cred_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH')
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        # Fallback for environments where Google Auth is automatic (e.g. Cloud Run/Functions)
        # or if using Modal secrets handled differently
        firebase_admin.initialize_app()

db = firestore.client()

class MultiTenantService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def get_tenant_config(self, tenant_id: str, bot_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetches the bot configuration for a specific tenant.
        Path: /tenants/{tenant_id}/bots/{bot_id}
        """
        try:
            doc_ref = db.collection('tenants').document(tenant_id).collection('bots').document(bot_id)
            doc = doc_ref.get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            self.logger.error(f"Error fetching config for tenant {tenant_id}, bot {bot_id}: {e}")
            return None

    def get_chat_history(self, tenant_id: str, bot_id: str, chat_id: str, limit: int = 20) -> list:
        """
        Retrieves recent chat history for context.
        Path: /tenants/{tenant_id}/bots/{bot_id}/chats/{chat_id}/messages
        """
        try:
            messages_ref = (
                db.collection('tenants').document(tenant_id)
                .collection('bots').document(bot_id)
                .collection('chats').document(chat_id)
                .collection('messages')
                .order_by('timestamp', direction=firestore.Query.DESCENDING)
                .limit(limit)
            )
            docs = messages_ref.stream()
            # Return reversed to have chronological order for the LLM
            return sorted([d.to_dict() for d in docs], key=lambda x: x['timestamp'])
        except Exception as e:
            self.logger.error(f"Error fetching chat history: {e}")
            return []

    def save_message(self, tenant_id: str, bot_id: str, chat_id: str, message_data: Dict[str, Any]):
        """
        Saves a message (user or assistant) to Firestore.
        Also updates the chat metadata (lastInteraction).
        """
        try:
            # References
            bot_ref = db.collection('tenants').document(tenant_id).collection('bots').document(bot_id)
            chat_ref = bot_ref.collection('chats').document(chat_id)
            
            # 1. Add message
            chat_ref.collection('messages').add(message_data)
            
            # 2. Update metadata
            chat_ref.set({
                'lastInteraction': firestore.SERVER_TIMESTAMP,
                'metadata': {
                    # Merge existing metadata if needed, but for now we assume it exists or we update timestamp
                }
            }, merge=True)
            
            # 3. Update bot stats (optional, could be done via Cloud Functions triggers to avoid write contention)
            # bot_ref.update({'stats.messagesCount': firestore.Increment(1)})
            
        except Exception as e:
            self.logger.error(f"Error saving message: {e}")
