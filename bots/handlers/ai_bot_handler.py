"""
AI Bot Handler
Simulates basic AI capabilities (keyword detection).
Ready for OpenAI integration.
"""

from typing import Dict, Any

async def handle_ai_bot(event: Any, config: Dict[str, Any], db: Any) -> Dict[str, Any]:
    text = event.text.lower()
    
    # Simulate Context Awareness
    business_name = config.get("settings", {}).get("business_name", "Negocio")
    
    if "cita" in text or "agendar" in text:
        reply = f"Claro, soy la IA de {business_name}. ¿Para qué día te gustaría agendar?"
        meta = {"intent": "schedule_request"}
        
    elif "precio" in text or "costo" in text:
        reply = f"Nuestros precios varían según el servicio. ¿Qué servicio te interesa de {business_name}?"
        meta = {"intent": "pricing_query"}
        
    else:
        # Default fallback
        reply = f"Soy la IA de {business_name}. Puedo ayudarte con citas o precios. ¿Qué necesitas?"
        meta = {"intent": "unknown"}

    # TODO: Integrate OpenAI here using config.get('openai_key')
    
    return {
        "reply_text": reply,
        "meta": meta
    }
