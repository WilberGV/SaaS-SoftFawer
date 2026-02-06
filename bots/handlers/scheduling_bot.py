"""
Scheduling Bot Handler
AI-powered appointment booking with optional Google Calendar integration
"""

from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import re


class SchedulingState:
    """Conversation states for scheduling flow"""
    IDLE = "idle"
    ASK_SERVICE = "ask_service"
    ASK_DATE = "ask_date"
    ASK_TIME = "ask_time"
    ASK_NAME = "ask_name"
    CONFIRMING = "confirming"
    CONFIRMED = "confirmed"


# Date parsing patterns (Spanish)
DATE_PATTERNS = {
    "hoy": 0,
    "manana": 1,
    "mañana": 1,
    "pasado manana": 2,
    "pasado mañana": 2,
    "lunes": None,
    "martes": None,
    "miercoles": None,
    "miércoles": None,
    "jueves": None,
    "viernes": None,
    "sabado": None,
    "sábado": None,
    "domingo": None,
}

WEEKDAY_MAP = {
    "lunes": 0, "martes": 1, "miercoles": 2, "miércoles": 2,
    "jueves": 3, "viernes": 4, "sabado": 5, "sábado": 5, "domingo": 6
}


def parse_date(text: str) -> Optional[datetime]:
    """Parse Spanish date expressions to datetime"""
    text_lower = text.lower().strip()
    today = datetime.now()
    
    # Check relative dates
    if text_lower in ["hoy"]:
        return today
    elif text_lower in ["manana", "mañana"]:
        return today + timedelta(days=1)
    elif text_lower in ["pasado manana", "pasado mañana"]:
        return today + timedelta(days=2)
    
    # Check weekdays
    for day_name, weekday in WEEKDAY_MAP.items():
        if day_name in text_lower:
            days_ahead = weekday - today.weekday()
            if days_ahead <= 0:  # Target day already happened this week
                days_ahead += 7
            return today + timedelta(days=days_ahead)
    
    # Try to parse "15 de febrero" format
    match = re.search(r"(\d{1,2})\s*(?:de)?\s*(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)", text_lower)
    if match:
        day = int(match.group(1))
        month_map = {
            "enero": 1, "febrero": 2, "marzo": 3, "abril": 4,
            "mayo": 5, "junio": 6, "julio": 7, "agosto": 8,
            "septiembre": 9, "octubre": 10, "noviembre": 11, "diciembre": 12
        }
        month = month_map.get(match.group(2), today.month)
        year = today.year
        if month < today.month or (month == today.month and day < today.day):
            year += 1
        try:
            return datetime(year, month, day)
        except ValueError:
            return None
    
    return None


def parse_time(text: str) -> Optional[str]:
    """Parse Spanish time expressions"""
    text_lower = text.lower().strip()
    
    # Direct time patterns
    match = re.search(r"(\d{1,2})(?::(\d{2}))?\s*(am|pm|hrs|h)?", text_lower)
    if match:
        hour = int(match.group(1))
        minute = int(match.group(2) or 0)
        period = match.group(3)
        
        if period == "pm" and hour < 12:
            hour += 12
        elif period == "am" and hour == 12:
            hour = 0
            
        return f"{hour:02d}:{minute:02d}"
    
    # Natural language
    if "manana" in text_lower or "mañana" in text_lower:
        return "10:00"
    elif "tarde" in text_lower:
        return "15:00"
    elif "noche" in text_lower:
        return "19:00"
    
    return None


def generate_time_slots(
    date: datetime,
    start_hour: int = 9,
    end_hour: int = 18,
    duration_min: int = 30,
    booked_slots: list[str] = None
) -> list[str]:
    """Generate available time slots for a date"""
    booked_slots = booked_slots or []
    slots = []
    
    current = date.replace(hour=start_hour, minute=0, second=0, microsecond=0)
    end = date.replace(hour=end_hour, minute=0, second=0, microsecond=0)
    
    while current < end:
        time_str = current.strftime("%H:%M")
        if time_str not in booked_slots:
            slots.append(time_str)
        current += timedelta(minutes=duration_min)
    
    return slots


async def handle_scheduling_bot(
    event: Any,
    service_config: Dict[str, Any],
    db: Any
) -> Dict[str, Any]:
    """
    Handle scheduling bot conversations.
    
    Supports:
    - Natural language date/time parsing
    - Multi-step booking flow
    - Optional Google Calendar integration
    
    Args:
        event: Incoming message event
        service_config: Service configuration from Firestore
        db: Firestore client
        
    Returns:
        Dict with reply_text and meta
    """
    text = event.text.strip().lower()
    settings = service_config.get("settings", {})
    business_name = settings.get("business_name", "Nuestro Negocio")
    services = settings.get("services", ["Consulta General"])
    
    # Get or create conversation state
    conv_ref = db.collection("tenants").document(event.tenantId)\
                  .collection("conversations").document(event.from_)
    conv_doc = conv_ref.get()
    
    conv_data = conv_doc.to_dict() if conv_doc.exists else {}
    state = conv_data.get("scheduling_state", SchedulingState.IDLE)
    pending = conv_data.get("pending_appointment", {})
    
    # Handle reset/cancel commands
    if text in ["cancelar", "reiniciar", "menu", "inicio", "salir"]:
        conv_ref.set({
            "scheduling_state": SchedulingState.IDLE,
            "pending_appointment": {},
            "updated_at": datetime.utcnow()
        }, merge=True)
        
        return {
            "reply_text": (
                f"Hola! Soy el asistente de citas de *{business_name}*.\n\n"
                "Puedo ayudarte a:\n"
                "1. Agendar una cita\n"
                "2. Ver mis citas\n"
                "3. Cancelar cita\n\n"
                "Que deseas hacer?"
            ),
            "meta": {"handler": "scheduling_bot", "state": "idle", "action": "reset"}
        }
    
    # State machine
    if state == SchedulingState.IDLE:
        if any(kw in text for kw in ["cita", "agendar", "reservar", "turno", "1"]):
            # Check if multiple services available
            if len(services) > 1:
                conv_ref.set({
                    "scheduling_state": SchedulingState.ASK_SERVICE,
                    "pending_appointment": {},
                    "updated_at": datetime.utcnow()
                }, merge=True)
                
                service_list = "\n".join(f"{i+1}. {s}" for i, s in enumerate(services))
                return {
                    "reply_text": f"Que servicio necesitas?\n\n{service_list}",
                    "meta": {"handler": "scheduling_bot", "state": "ask_service"}
                }
            else:
                # Single service, skip to date
                pending["service"] = services[0]
                conv_ref.set({
                    "scheduling_state": SchedulingState.ASK_DATE,
                    "pending_appointment": pending,
                    "updated_at": datetime.utcnow()
                }, merge=True)
                
                return {
                    "reply_text": (
                        f"Perfecto! Vamos a agendar tu *{services[0]}*.\n\n"
                        "Para que dia te gustaria?\n\n"
                        "Ejemplos: 'manana', 'lunes', '15 de febrero'"
                    ),
                    "meta": {"handler": "scheduling_bot", "state": "ask_date"}
                }
        
        elif any(kw in text for kw in ["ver", "mis citas", "2"]):
            # TODO: List user's appointments
            return {
                "reply_text": "Esta funcion estara disponible pronto.\n\nEscribe 'cita' para agendar.",
                "meta": {"handler": "scheduling_bot", "action": "view_appointments"}
            }
        
        else:
            return {
                "reply_text": (
                    f"Hola! Soy el asistente de citas de *{business_name}*.\n\n"
                    "Escribe *'cita'* para agendar o *'menu'* para ver opciones."
                ),
                "meta": {"handler": "scheduling_bot", "state": "idle"}
            }
    
    elif state == SchedulingState.ASK_SERVICE:
        # Try to match service by number or name
        try:
            idx = int(text) - 1
            if 0 <= idx < len(services):
                pending["service"] = services[idx]
            else:
                pending["service"] = services[0]
        except ValueError:
            # Match by partial name
            matched = next((s for s in services if text in s.lower()), services[0])
            pending["service"] = matched
        
        conv_ref.set({
            "scheduling_state": SchedulingState.ASK_DATE,
            "pending_appointment": pending,
            "updated_at": datetime.utcnow()
        }, merge=True)
        
        return {
            "reply_text": (
                f"Servicio: *{pending['service']}*\n\n"
                "Para que dia te gustaria?\n\n"
                "Ejemplos: 'manana', 'lunes', '15 de febrero'"
            ),
            "meta": {"handler": "scheduling_bot", "state": "ask_date"}
        }
    
    elif state == SchedulingState.ASK_DATE:
        parsed_date = parse_date(event.text)
        
        if not parsed_date:
            return {
                "reply_text": (
                    "No entendi la fecha. Intenta con:\n"
                    "- 'manana'\n"
                    "- 'lunes'\n"
                    "- '15 de febrero'"
                ),
                "meta": {"handler": "scheduling_bot", "state": "ask_date", "error": "invalid_date"}
            }
        
        # Check if date is in the past
        if parsed_date.date() < datetime.now().date():
            return {
                "reply_text": "Esa fecha ya paso. Por favor elige una fecha futura.",
                "meta": {"handler": "scheduling_bot", "state": "ask_date", "error": "past_date"}
            }
        
        pending["date"] = parsed_date.strftime("%Y-%m-%d")
        pending["date_display"] = parsed_date.strftime("%A %d de %B")
        
        # Generate available slots (mock - would integrate with Calendar)
        slots = generate_time_slots(parsed_date)
        
        if not slots:
            return {
                "reply_text": f"No hay horarios disponibles el {pending['date_display']}. Quieres probar otro dia?",
                "meta": {"handler": "scheduling_bot", "state": "ask_date", "error": "no_slots"}
            }
        
        # Store slots for validation
        pending["available_slots"] = slots[:8]  # Limit to 8 slots
        
        conv_ref.set({
            "scheduling_state": SchedulingState.ASK_TIME,
            "pending_appointment": pending,
            "updated_at": datetime.utcnow()
        }, merge=True)
        
        slots_display = "\n".join(f"- {s}" for s in slots[:8])
        return {
            "reply_text": (
                f"Disponibilidad para el *{pending['date_display']}*:\n\n"
                f"{slots_display}\n\n"
                "Cual horario prefieres?"
            ),
            "meta": {"handler": "scheduling_bot", "state": "ask_time"}
        }
    
    elif state == SchedulingState.ASK_TIME:
        parsed_time = parse_time(event.text)
        
        if not parsed_time:
            return {
                "reply_text": "No entendi la hora. Escribe algo como '10:00' o '3pm'.",
                "meta": {"handler": "scheduling_bot", "state": "ask_time", "error": "invalid_time"}
            }
        
        pending["time"] = parsed_time
        
        conv_ref.set({
            "scheduling_state": SchedulingState.ASK_NAME,
            "pending_appointment": pending,
            "updated_at": datetime.utcnow()
        }, merge=True)
        
        return {
            "reply_text": (
                f"*{pending['date_display']}* a las *{parsed_time}*\n\n"
                "A nombre de quien sera la cita?"
            ),
            "meta": {"handler": "scheduling_bot", "state": "ask_name"}
        }
    
    elif state == SchedulingState.ASK_NAME:
        pending["name"] = event.text.strip().title()
        pending["phone"] = event.from_
        pending["created_at"] = datetime.utcnow().isoformat()
        pending["status"] = "confirmed"
        
        # Save appointment to Firestore
        appointments_ref = db.collection("tenants").document(event.tenantId)\
                            .collection("appointments")
        doc_ref = appointments_ref.add(pending)
        appointment_id = doc_ref[1].id[:8].upper()
        
        # Reset conversation state
        conv_ref.set({
            "scheduling_state": SchedulingState.CONFIRMED,
            "pending_appointment": {},
            "last_appointment_id": appointment_id,
            "updated_at": datetime.utcnow()
        }, merge=True)
        
        return {
            "reply_text": (
                f"*Cita confirmada!*\n\n"
                f"Nombre: {pending['name']}\n"
                f"Servicio: {pending.get('service', 'Consulta')}\n"
                f"Fecha: {pending['date_display']}\n"
                f"Hora: {pending['time']}\n"
                f"ID: #{appointment_id}\n\n"
                f"Te esperamos en *{business_name}*!\n\n"
                f"Para cancelar, escribe 'cancelar'"
            ),
            "meta": {
                "handler": "scheduling_bot",
                "state": "confirmed",
                "appointment_id": appointment_id
            }
        }
    
    elif state == SchedulingState.CONFIRMED:
        # Reset for new conversation
        conv_ref.set({
            "scheduling_state": SchedulingState.IDLE,
            "pending_appointment": {},
            "updated_at": datetime.utcnow()
        }, merge=True)
        
        return {
            "reply_text": "Escribe *'cita'* para agendar otra cita.",
            "meta": {"handler": "scheduling_bot", "state": "idle"}
        }
    
    # Fallback
    return {
        "reply_text": "Escribe *'menu'* para ver las opciones.",
        "meta": {"handler": "scheduling_bot", "state": state, "action": "fallback"}
    }
