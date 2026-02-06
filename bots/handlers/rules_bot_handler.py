"""
Rules Bot Handler
State-machine based bot for Menus and Appointments.
"""

from typing import Dict, Any
from datetime import datetime

async def handle_rule_bot(event: Any, config: Dict[str, Any], db: Any) -> Dict[str, Any]:
    text = event.text.strip()
    settings = config.get("settings", {})
    mode = settings.get("mode", "support") # 'support' or 'appointments'
    
    if mode == "support":
        return handle_support_mode(text, settings)
        
    elif mode == "appointments":
        return await handle_appointment_mode(event, settings, db)
        
    return {"reply_text": "Configuración de bot inválida."}


def handle_support_mode(text: str, settings: Dict[str, Any]) -> Dict[str, Any]:
    if text == "1":
        hours = settings.get("opening_hours", "9am - 6pm")
        return {"reply_text": f"Nuestros horarios son:\n{hours}"}
        
    elif text == "2":
        addr = settings.get("address", "Calle Falsa 123")
        return {"reply_text": f"Estamos ubicados en:\n{addr}"}
        
    else:
        return {"reply_text": "Bienvenido. Elige una opción:\n1) Horarios\n2) Ubicación"}


async def handle_appointment_mode(event: Any, settings: Dict[str, Any], db: Any) -> Dict[str, Any]:
    # State management in Firestore
    conv_ref = db.collection("tenants").document(event.tenantId)\
                 .collection("conversations").document(event.from_)
                 
    conv_doc = conv_ref.get()
    state = conv_doc.to_dict().get("state", "INIT") if conv_doc.exists else "INIT"
    data = conv_doc.to_dict().get("data", {}) if conv_doc.exists else {}
    
    reply = ""
    new_state = state
    
    if state == "INIT":
        reply = "Hola. ¿Para qué fecha quieres reservar? (Ej: 2026-02-20)"
        new_state = "ASK_DATE"
        
    elif state == "ASK_DATE":
        # Save date
        data["date"] = text
        reply = f"Perfecto. ¿A qué hora? (Ej: 15:00)"
        new_state = "ASK_TIME"
        
    elif state == "ASK_TIME":
        # Save time
        data["time"] = text
        reply = f"✅ Confirmada tu cita para el {data['date']} a las {data['time']}."
        new_state = "CONFIRMED"
        # Here we would integrate with Calendar
        
    elif state == "CONFIRMED":
        reply = "Ya tienes una cita confirmada. Escribe 'cancelar' para empezar de nuevo."
        if text.lower() == "cancelar":
            new_state = "INIT"
            reply = "Cita cancelada. ¿Para cuándo quieres reservar?"
            
    # Update State
    conv_ref.set({
        "state": new_state,
        "data": data,
        "last_updated": datetime.utcnow()
    }, merge=True)
    
    return {"reply_text": reply}
