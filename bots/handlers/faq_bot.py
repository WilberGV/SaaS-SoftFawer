"""
FAQ Bot Handler
AI-powered question answering with optional OpenAI integration
Falls back to keyword matching when OpenAI is not configured
"""

from typing import Dict, Any, Optional, List
from datetime import datetime
import re


# Knowledge base structure for fallback
DEFAULT_KNOWLEDGE = {
    "horarios": {
        "keywords": ["horario", "hora", "abierto", "cerrado", "atencion", "abren", "cierran"],
        "answer": "Nuestro horario de atencion es:\n\nLunes a Viernes: 9:00 - 18:00\nSabados: 9:00 - 13:00\nDomingos: Cerrado"
    },
    "ubicacion": {
        "keywords": ["donde", "ubicacion", "direccion", "llegar", "mapa", "ubicados"],
        "answer": "Nos encontramos en:\n\nAv. Principal 123\nCiudad, Pais\n\nTe esperamos!"
    },
    "precios": {
        "keywords": ["precio", "costo", "cuanto", "vale", "cobran", "tarifa"],
        "answer": "Nuestros precios varian segun el servicio.\n\nContactanos para una cotizacion personalizada."
    },
    "contacto": {
        "keywords": ["telefono", "email", "correo", "contacto", "llamar", "whatsapp"],
        "answer": "Puedes contactarnos:\n\nWhatsApp: Este mismo chat\nEmail: info@empresa.com"
    },
    "servicios": {
        "keywords": ["servicio", "ofrecen", "hacen", "productos", "catalogo"],
        "answer": "Ofrecemos una variedad de servicios.\n\nEscribe 'menu' para ver las opciones disponibles."
    },
    "pago": {
        "keywords": ["pago", "pagar", "transferencia", "efectivo", "tarjeta", "metodo"],
        "answer": "Aceptamos:\n\n- Efectivo\n- Tarjeta de credito/debito\n- Transferencia bancaria"
    }
}


def find_best_match(text: str, knowledge_base: Dict) -> Optional[Dict]:
    """Find best matching answer from knowledge base"""
    text_lower = text.lower()
    
    best_match = None
    best_score = 0
    
    for topic, data in knowledge_base.items():
        keywords = data.get("keywords", [])
        score = sum(1 for kw in keywords if kw in text_lower)
        
        if score > best_score:
            best_score = score
            best_match = data
    
    return best_match if best_score > 0 else None


async def call_openai(
    question: str,
    context: str,
    api_key: str,
    model: str = "gpt-4o-mini"
) -> Optional[str]:
    """Call OpenAI API for intelligent response"""
    try:
        import httpx
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "messages": [
                        {
                            "role": "system",
                            "content": (
                                "Eres un asistente de atencion al cliente amable y profesional. "
                                "Responde de forma concisa en espanol. "
                                "Si no sabes algo, sugiere contactar a un agente humano.\n\n"
                                f"Contexto del negocio:\n{context}"
                            )
                        },
                        {"role": "user", "content": question}
                    ],
                    "max_tokens": 300,
                    "temperature": 0.7
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            else:
                return None
                
    except Exception as e:
        print(f"OpenAI error: {e}")
        return None


async def handle_faq_bot(
    event: Any,
    service_config: Dict[str, Any],
    db: Any
) -> Dict[str, Any]:
    """
    Handle FAQ bot conversations.
    
    Features:
    - OpenAI integration (when API key is configured)
    - Fallback to keyword-based matching
    - Custom knowledge base from Firestore
    - Escalation to human agents
    
    Args:
        event: Incoming message event
        service_config: Service configuration from Firestore
        db: Firestore client
        
    Returns:
        Dict with reply_text and meta
    """
    import os
    
    text = event.text.strip()
    text_lower = text.lower()
    settings = service_config.get("settings", {})
    business_name = settings.get("business_name", "Nuestro Negocio")
    
    # Get conversation state for context
    conv_ref = db.collection("tenants").document(event.tenantId)\
                  .collection("conversations").document(event.from_)
    conv_doc = conv_ref.get()
    conv_data = conv_doc.to_dict() if conv_doc.exists else {}
    
    # Check for escalation request
    if any(kw in text_lower for kw in ["agente", "humano", "persona", "hablar con"]):
        hours = settings.get("support_hours", "Lunes a Viernes 9:00 - 18:00")
        
        conv_ref.set({
            "escalated": True,
            "escalated_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }, merge=True)
        
        return {
            "reply_text": (
                "Entiendo que necesitas hablar con alguien.\n\n"
                f"Un agente te contactara pronto.\n"
                f"Horario de atencion: {hours}"
            ),
            "meta": {
                "handler": "faq_bot",
                "action": "escalate",
                "escalated": True
            }
        }
    
    # Check for feedback from previous answer
    if conv_data.get("awaiting_feedback"):
        conv_ref.set({"awaiting_feedback": False, "updated_at": datetime.utcnow()}, merge=True)
        
        if text_lower in ["1", "si", "yes"]:
            return {
                "reply_text": "Me alegra haberte ayudado! Algo mas en lo que pueda ayudarte?",
                "meta": {"handler": "faq_bot", "action": "feedback_positive"}
            }
        elif text_lower in ["2", "no"]:
            return {
                "reply_text": (
                    "Lamento no poder ayudarte mejor.\n\n"
                    "Escribe 'agente' para hablar con una persona."
                ),
                "meta": {"handler": "faq_bot", "action": "feedback_negative"}
            }
    
    # Get custom knowledge base or use default
    knowledge_base = settings.get("knowledge_base", DEFAULT_KNOWLEDGE)
    
    # Build context for AI
    business_context = settings.get("business_context", f"{business_name} - Empresa de servicios")
    
    # Try OpenAI if configured
    openai_key = os.environ.get("OPENAI_API_KEY")
    ai_enabled = settings.get("ai_enabled", True) and openai_key
    
    answer = None
    source = "fallback"
    
    if ai_enabled:
        answer = await call_openai(
            question=text,
            context=business_context,
            api_key=openai_key,
            model=settings.get("model", "gpt-4o-mini")
        )
        if answer:
            source = "openai"
    
    # Fallback to keyword matching
    if not answer:
        match = find_best_match(text, knowledge_base)
        if match:
            answer = match["answer"]
            source = "knowledge_base"
    
    # No match found
    if not answer:
        topics = list(knowledge_base.keys())
        topics_list = "\n".join(f"- {t.title()}" for t in topics[:5])
        
        return {
            "reply_text": (
                "No encontre informacion sobre eso.\n\n"
                f"Puedo ayudarte con:\n{topics_list}\n\n"
                "O escribe 'agente' para hablar con una persona."
            ),
            "meta": {
                "handler": "faq_bot",
                "action": "no_match",
                "source": "none"
            }
        }
    
    # Save that we're awaiting feedback
    conv_ref.set({
        "awaiting_feedback": True,
        "last_question": text,
        "updated_at": datetime.utcnow()
    }, merge=True)
    
    return {
        "reply_text": (
            f"{answer}\n\n"
            "Te fue util esta respuesta?\n"
            "1. Si\n"
            "2. No, necesito mas ayuda"
        ),
        "meta": {
            "handler": "faq_bot",
            "action": "answer",
            "source": source,
            "ai_used": source == "openai"
        }
    }
