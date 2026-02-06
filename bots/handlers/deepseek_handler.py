"""
DeepSeek AI Handler (Modal Version)
Handles interaction with DeepSeek API for natural language understanding within the Modal environment.
"""

from typing import Dict, Any, List
import json
import logging

# System prompt for the AI
SYSTEM_PROMPT = """
Eres Sofía, una asistente virtual inteligente y amable para agendar citas.
Tu objetivo es ayudar al usuario a agendar una cita o responder sus dudas.

Si el usuario quiere agendar, debes extraer:
1. Intención: "schedule"
2. Fecha (date)
3. Hora (time)
4. Motivo (summary)

Responde SIEMPRE en formato JSON estricto con la siguiente estructura:
{
    "reply": "Texto de respuesta para el usuario",
    "intent": "chat" | "schedule" | "confirm_schedule",
    "data": {
        "date": "YYYY-MM-DD" (si aplica, sino null),
        "time": "HH:MM" (si aplica, sino null),
        "summary": "texto" (si aplica)
    }
}

Si faltan datos para agendar, tu "intent" debe ser "chat" y en "reply" pides el dato faltante.
Se breve, cordial y profesional. Habla español latinoamericano.
"""

async def handle_deepseek_bot(event: Any, config: Dict[str, Any], db: Any) -> Dict[str, Any]:
    """
    Process message using DeepSeek via Modal Secrets.
    """
    import os
    from openai import OpenAI
    
    # Extract message details
    # Modal event structure depends on the Router, usually passed as dict or Pydantic model
    # Assuming 'text' is accessible directly or via .message
    if hasattr(event, "message"):
        text = event.message
    else:
        text = str(event) # Fallback

    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        return {"reply": "Error: DeepSeek API Key not configured in Modal."}

    client = OpenAI(
        api_key=api_key, 
        base_url="https://ark.ap-southeast.bytepluses.com/api/v3"
    )

    try:
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Usuario: {text}"}
        ]

        response = client.chat.completions.create(
            model="deepseek-v3-2-251201",
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.7,
            max_tokens=500
        )

        content = response.choices[0].message.content
        
        try:
            data = json.loads(content)
        except json.JSONDecodeError:
            data = {
                "reply": content,
                "intent": "chat"
            }
            
        return data

    except Exception as e:
        print(f"DeepSeek Error: {e}")
        return {"reply": "Lo siento, tuve un problema procesando tu mensaje."}
