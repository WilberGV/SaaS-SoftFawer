"""
Lead Qualification Bot Handler
Rule-based lead capture with validation and CRM-ready output
"""

from typing import Dict, Any, Optional
from datetime import datetime
import re


class LeadState:
    """Conversation states for lead qualification flow"""
    IDLE = "idle"
    ASK_INDUSTRY = "ask_industry"
    ASK_SIZE = "ask_size"
    ASK_BUDGET = "ask_budget"
    ASK_EMAIL = "ask_email"
    ASK_PHONE = "ask_phone"
    ASK_NAME = "ask_name"
    COMPLETED = "completed"


# Industry options
INDUSTRIES = [
    "Salud y Bienestar",
    "Retail y Comercio",
    "Servicios Profesionales",
    "Tecnologia",
    "Educacion",
    "Gastronomia",
    "Otro"
]

# Company size options
COMPANY_SIZES = [
    "1-10 empleados",
    "11-50 empleados",
    "51-200 empleados",
    "Mas de 200 empleados"
]

# Budget ranges
BUDGETS = [
    "Menos de $100/mes",
    "$100 - $500/mes",
    "$500 - $2000/mes",
    "Mas de $2000/mes"
]


def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email.strip()))


def validate_phone(phone: str) -> bool:
    """Validate phone number (international format)"""
    # Remove spaces, dashes, parentheses
    cleaned = re.sub(r'[\s\-\(\)]', '', phone)
    # Should have at least 10 digits, optionally starting with +
    pattern = r'^\+?\d{10,15}$'
    return bool(re.match(pattern, cleaned))


def calculate_lead_score(lead_data: Dict[str, Any]) -> int:
    """Calculate lead score (0-100) based on qualification data"""
    score = 0
    
    # Industry score (some industries are higher value)
    industry_scores = {
        "Salud y Bienestar": 25,
        "Servicios Profesionales": 25,
        "Tecnologia": 20,
        "Retail y Comercio": 15,
        "Educacion": 15,
        "Gastronomia": 10,
        "Otro": 5
    }
    score += industry_scores.get(lead_data.get("industry", ""), 5)
    
    # Company size score
    size_scores = {
        "1-10 empleados": 10,
        "11-50 empleados": 20,
        "51-200 empleados": 25,
        "Mas de 200 empleados": 30
    }
    score += size_scores.get(lead_data.get("company_size", ""), 10)
    
    # Budget score
    budget_scores = {
        "Menos de $100/mes": 5,
        "$100 - $500/mes": 15,
        "$500 - $2000/mes": 25,
        "Mas de $2000/mes": 35
    }
    score += budget_scores.get(lead_data.get("budget", ""), 5)
    
    # Contact info bonus
    if lead_data.get("email"):
        score += 5
    if lead_data.get("phone"):
        score += 5
    
    return min(score, 100)


def get_lead_priority(score: int) -> str:
    """Get priority label based on score"""
    if score >= 75:
        return "HOT"
    elif score >= 50:
        return "WARM"
    else:
        return "COLD"


async def handle_lead_bot(
    event: Any,
    service_config: Dict[str, Any],
    db: Any
) -> Dict[str, Any]:
    """
    Handle lead qualification bot conversations.
    
    Features:
    - Sequential question flow
    - Email/phone validation
    - Lead scoring
    - State persistence
    - CRM-ready output
    
    Args:
        event: Incoming message event
        service_config: Service configuration from Firestore
        db: Firestore client
        
    Returns:
        Dict with reply_text and meta
    """
    text = event.text.strip()
    text_lower = text.lower()
    settings = service_config.get("settings", {})
    business_name = settings.get("business_name", "Nuestro Negocio")
    
    # Get or create conversation state
    conv_ref = db.collection("tenants").document(event.tenantId)\
                  .collection("conversations").document(event.from_)
    conv_doc = conv_ref.get()
    
    conv_data = conv_doc.to_dict() if conv_doc.exists else {}
    state = conv_data.get("lead_state", LeadState.IDLE)
    lead_data = conv_data.get("lead_data", {})
    
    # Handle reset commands
    if text_lower in ["cancelar", "reiniciar", "salir"]:
        conv_ref.set({
            "lead_state": LeadState.IDLE,
            "lead_data": {},
            "updated_at": datetime.utcnow()
        }, merge=True)
        
        return {
            "reply_text": "Proceso cancelado. Escribe 'hola' para empezar de nuevo.",
            "meta": {"handler": "lead_bot", "state": "idle", "action": "reset"}
        }
    
    # State machine
    if state == LeadState.IDLE:
        # Start lead qualification
        lead_data = {"started_at": datetime.utcnow().isoformat()}
        
        conv_ref.set({
            "lead_state": LeadState.ASK_INDUSTRY,
            "lead_data": lead_data,
            "updated_at": datetime.utcnow()
        }, merge=True)
        
        industry_list = "\n".join(f"{i+1}. {ind}" for i, ind in enumerate(INDUSTRIES))
        
        return {
            "reply_text": (
                f"Hola! Gracias por tu interes en *{business_name}*.\n\n"
                "Te hare unas preguntas rapidas para conocerte mejor.\n\n"
                f"En que industria trabajas?\n\n{industry_list}"
            ),
            "meta": {"handler": "lead_bot", "state": "ask_industry"}
        }
    
    elif state == LeadState.ASK_INDUSTRY:
        # Parse industry selection
        try:
            idx = int(text) - 1
            if 0 <= idx < len(INDUSTRIES):
                lead_data["industry"] = INDUSTRIES[idx]
            else:
                lead_data["industry"] = INDUSTRIES[-1]  # "Otro"
        except ValueError:
            # Try to match by partial name
            matched = next((ind for ind in INDUSTRIES if text_lower in ind.lower()), INDUSTRIES[-1])
            lead_data["industry"] = matched
        
        conv_ref.set({
            "lead_state": LeadState.ASK_SIZE,
            "lead_data": lead_data,
            "updated_at": datetime.utcnow()
        }, merge=True)
        
        size_list = "\n".join(f"{i+1}. {s}" for i, s in enumerate(COMPANY_SIZES))
        
        return {
            "reply_text": (
                f"*{lead_data['industry']}* - excelente!\n\n"
                f"Cuantos empleados tiene tu empresa?\n\n{size_list}"
            ),
            "meta": {"handler": "lead_bot", "state": "ask_size"}
        }
    
    elif state == LeadState.ASK_SIZE:
        try:
            idx = int(text) - 1
            if 0 <= idx < len(COMPANY_SIZES):
                lead_data["company_size"] = COMPANY_SIZES[idx]
            else:
                lead_data["company_size"] = COMPANY_SIZES[0]
        except ValueError:
            lead_data["company_size"] = COMPANY_SIZES[0]
        
        conv_ref.set({
            "lead_state": LeadState.ASK_BUDGET,
            "lead_data": lead_data,
            "updated_at": datetime.utcnow()
        }, merge=True)
        
        budget_list = "\n".join(f"{i+1}. {b}" for i, b in enumerate(BUDGETS))
        
        return {
            "reply_text": (
                "Cual es tu presupuesto mensual aproximado para esta solucion?\n\n"
                f"{budget_list}"
            ),
            "meta": {"handler": "lead_bot", "state": "ask_budget"}
        }
    
    elif state == LeadState.ASK_BUDGET:
        try:
            idx = int(text) - 1
            if 0 <= idx < len(BUDGETS):
                lead_data["budget"] = BUDGETS[idx]
            else:
                lead_data["budget"] = BUDGETS[0]
        except ValueError:
            lead_data["budget"] = BUDGETS[0]
        
        conv_ref.set({
            "lead_state": LeadState.ASK_NAME,
            "lead_data": lead_data,
            "updated_at": datetime.utcnow()
        }, merge=True)
        
        return {
            "reply_text": "Genial! Como te llamas?",
            "meta": {"handler": "lead_bot", "state": "ask_name"}
        }
    
    elif state == LeadState.ASK_NAME:
        lead_data["name"] = text.strip().title()
        
        conv_ref.set({
            "lead_state": LeadState.ASK_EMAIL,
            "lead_data": lead_data,
            "updated_at": datetime.utcnow()
        }, merge=True)
        
        return {
            "reply_text": (
                f"Mucho gusto, *{lead_data['name']}*!\n\n"
                "Dejame tu correo electronico para enviarte informacion:"
            ),
            "meta": {"handler": "lead_bot", "state": "ask_email"}
        }
    
    elif state == LeadState.ASK_EMAIL:
        if not validate_email(text):
            return {
                "reply_text": (
                    "Ese correo no parece valido.\n\n"
                    "Por favor ingresa un correo como: ejemplo@empresa.com"
                ),
                "meta": {"handler": "lead_bot", "state": "ask_email", "error": "invalid_email"}
            }
        
        lead_data["email"] = text.strip().lower()
        
        conv_ref.set({
            "lead_state": LeadState.ASK_PHONE,
            "lead_data": lead_data,
            "updated_at": datetime.utcnow()
        }, merge=True)
        
        return {
            "reply_text": (
                "Perfecto! Y tu numero de telefono para que un asesor te contacte:\n\n"
                "(Puedes escribir 'omitir' si prefieres no darlo)"
            ),
            "meta": {"handler": "lead_bot", "state": "ask_phone"}
        }
    
    elif state == LeadState.ASK_PHONE:
        if text_lower in ["omitir", "skip", "no"]:
            lead_data["phone"] = event.from_  # Use WhatsApp number
        elif validate_phone(text):
            lead_data["phone"] = re.sub(r'[\s\-\(\)]', '', text)
        else:
            return {
                "reply_text": (
                    "Ese numero no parece valido.\n\n"
                    "Ingresa tu numero con codigo de pais: +521234567890\n"
                    "O escribe 'omitir'"
                ),
                "meta": {"handler": "lead_bot", "state": "ask_phone", "error": "invalid_phone"}
            }
        
        # Calculate lead score
        lead_data["score"] = calculate_lead_score(lead_data)
        lead_data["priority"] = get_lead_priority(lead_data["score"])
        lead_data["completed_at"] = datetime.utcnow().isoformat()
        lead_data["whatsapp"] = event.from_
        lead_data["status"] = "new"
        
        # Save lead to Firestore
        leads_ref = db.collection("tenants").document(event.tenantId)\
                      .collection("leads")
        doc_ref = leads_ref.add(lead_data)
        lead_id = doc_ref[1].id
        
        # Update conversation state
        conv_ref.set({
            "lead_state": LeadState.COMPLETED,
            "lead_data": {},
            "last_lead_id": lead_id,
            "updated_at": datetime.utcnow()
        }, merge=True)
        
        return {
            "reply_text": (
                "Excelente! Hemos registrado tu informacion.\n\n"
                f"*Resumen:*\n"
                f"Nombre: {lead_data['name']}\n"
                f"Industria: {lead_data['industry']}\n"
                f"Empresa: {lead_data['company_size']}\n"
                f"Email: {lead_data['email']}\n\n"
                f"Un asesor te contactara en las proximas 24 horas.\n\n"
                f"Gracias por tu interes en *{business_name}*!"
            ),
            "meta": {
                "handler": "lead_bot",
                "state": "completed",
                "lead_id": lead_id,
                "lead_score": lead_data["score"],
                "lead_priority": lead_data["priority"]
            }
        }
    
    elif state == LeadState.COMPLETED:
        # Reset for new conversation
        conv_ref.set({
            "lead_state": LeadState.IDLE,
            "lead_data": {},
            "updated_at": datetime.utcnow()
        }, merge=True)
        
        return {
            "reply_text": "Ya registramos tu informacion anteriormente. Un asesor te contactara pronto!",
            "meta": {"handler": "lead_bot", "state": "idle"}
        }
    
    # Fallback
    return {
        "reply_text": "Escribe 'hola' para iniciar.",
        "meta": {"handler": "lead_bot", "state": state, "action": "fallback"}
    }
