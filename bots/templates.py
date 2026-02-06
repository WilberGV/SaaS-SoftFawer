"""
Message Templates for SoftFawer Bots
Reusable Spanish templates for WhatsApp responses
"""

from typing import Dict, Any


class Templates:
    """Spanish message templates for all bot types"""
    
    # =========== GENERAL ===========
    WELCOME = (
        "Hola {name}! Bienvenido/a a {business}.\n\n"
        "{menu}"
    )
    
    ERROR_GENERIC = (
        "Lo siento, hubo un problema procesando tu mensaje. "
        "Por favor intenta de nuevo o escribe 'menu' para ver las opciones."
    )
    
    GOODBYE = (
        "Gracias por contactarnos! Si necesitas algo mas, "
        "escribe 'hola' para iniciar una nueva conversacion."
    )
    
    # =========== SCHEDULING BOT ===========
    SCHEDULING_WELCOME = (
        "Hola {name}! Soy el asistente de citas de {business}.\n\n"
        "Puedo ayudarte a:\n"
        "1. Agendar una cita\n"
        "2. Ver mis citas\n"
        "3. Cancelar o reprogramar\n\n"
        "Que deseas hacer?"
    )
    
    SCHEDULING_ASK_DATE = (
        "Perfecto! Para que dia te gustaria agendar?\n\n"
        "Puedes decirme:\n"
        "- 'Manana'\n"
        "- 'Lunes'\n"
        "- '15 de febrero'\n"
        "- 'La proxima semana'"
    )
    
    SCHEDULING_ASK_TIME = (
        "Tenemos disponibilidad el {date}:\n\n"
        "{slots}\n\n"
        "Cual horario prefieres?"
    )
    
    SCHEDULING_ASK_NAME = (
        "Excelente! {time} el {date}.\n\n"
        "A nombre de quien sera la cita?"
    )
    
    SCHEDULING_CONFIRM = (
        "Cita confirmada!\n\n"
        "Nombre: {name}\n"
        "Fecha: {date}\n"
        "Hora: {time}\n"
        "Servicio: {service}\n"
        "ID: {id}\n\n"
        "Te esperamos en {business}!\n"
        "Para cancelar, escribe 'cancelar {id}'"
    )
    
    SCHEDULING_NO_SLOTS = (
        "Lo siento, no hay horarios disponibles el {date}.\n\n"
        "Te gustaria ver otro dia? Puedes decirme otra fecha."
    )
    
    SCHEDULING_CANCELLED = (
        "Tu cita ha sido cancelada.\n\n"
        "Si deseas agendar una nueva, escribe 'cita'."
    )
    
    # =========== FAQ BOT ===========
    FAQ_THINKING = "Dame un momento mientras busco esa informacion..."
    
    FAQ_ANSWER = (
        "{answer}\n\n"
        "Te fue util esta respuesta?\n"
        "1. Si\n"
        "2. No, necesito hablar con alguien"
    )
    
    FAQ_ESCALATE = (
        "Entiendo que necesitas mas ayuda.\n\n"
        "Un agente te contactara pronto.\n"
        "Horario de atencion: {hours}"
    )
    
    FAQ_NOT_FOUND = (
        "No encontre informacion sobre eso.\n\n"
        "Puedo ayudarte con:\n"
        "{topics}\n\n"
        "O escribe 'agente' para hablar con una persona."
    )
    
    # =========== LEAD BOT ===========
    LEAD_WELCOME = (
        "Hola! Gracias por tu interes en {business}.\n\n"
        "Te hare unas preguntas rapidas para poder ayudarte mejor.\n\n"
        "En que industria trabajas?\n"
        "1. Salud\n"
        "2. Retail/Comercio\n"
        "3. Servicios Profesionales\n"
        "4. Tecnologia\n"
        "5. Otro"
    )
    
    LEAD_ASK_SIZE = (
        "Perfecto! Y cuantos empleados tiene tu empresa?\n"
        "1. 1-10\n"
        "2. 11-50\n"
        "3. 51-200\n"
        "4. Mas de 200"
    )
    
    LEAD_ASK_BUDGET = (
        "Cual es tu presupuesto mensual aproximado para esta solucion?\n"
        "1. Menos de $100\n"
        "2. $100 - $500\n"
        "3. $500 - $2000\n"
        "4. Mas de $2000"
    )
    
    LEAD_ASK_EMAIL = (
        "Genial! Dejame tu correo electronico para enviarte informacion."
    )
    
    LEAD_ASK_PHONE = (
        "Y tu numero de telefono para que un asesor te contacte:"
    )
    
    LEAD_COMPLETE = (
        "Excelente! Hemos registrado tu informacion.\n\n"
        "Un asesor te contactara en las proximas 24 horas.\n\n"
        "Gracias por tu interes en {business}!"
    )
    
    LEAD_INVALID_EMAIL = (
        "Ese correo no parece valido. "
        "Por favor ingresa un correo como ejemplo@empresa.com"
    )
    
    LEAD_INVALID_PHONE = (
        "Ese telefono no parece valido. "
        "Por favor ingresa tu numero con codigo de pais, ej: +521234567890"
    )
    
    # =========== NOTIFICATION BOT ===========
    REMINDER_24H = (
        "Recordatorio: Tienes una cita manana!\n\n"
        "Fecha: {date}\n"
        "Hora: {time}\n"
        "Lugar: {location}\n\n"
        "Confirma tu asistencia:\n"
        "1. Confirmo\n"
        "2. Necesito cancelar"
    )
    
    REMINDER_1H = (
        "Tu cita es en 1 hora!\n\n"
        "Hora: {time}\n"
        "Lugar: {location}\n\n"
        "Te esperamos!"
    )
    
    ORDER_SHIPPED = (
        "Tu pedido #{order_id} ha sido enviado!\n\n"
        "Numero de rastreo: {tracking}\n"
        "Entrega estimada: {eta}\n\n"
        "Rastrear: {tracking_url}"
    )
    
    ORDER_DELIVERED = (
        "Tu pedido #{order_id} fue entregado!\n\n"
        "Gracias por tu compra.\n"
        "Calificanos del 1 al 5"
    )
    
    PAYMENT_RECEIVED = (
        "Pago recibido!\n\n"
        "Monto: ${amount}\n"
        "Referencia: {reference}\n\n"
        "Gracias por tu pago!"
    )
    
    PAYMENT_DUE = (
        "Recordatorio de pago\n\n"
        "Tienes un pago pendiente de ${amount}.\n"
        "Fecha limite: {due_date}\n\n"
        "Pagar ahora: {payment_url}"
    )


def build_menu(options: list[str]) -> str:
    """Build numbered menu from options list"""
    return "\n".join(f"{i+1}. {opt}" for i, opt in enumerate(options))


def format_slots(slots: list[str]) -> str:
    """Format available time slots"""
    return "\n".join(f"- {slot}" for slot in slots)


def format_template(template: str, **kwargs) -> str:
    """Safe format template with fallback for missing keys"""
    try:
        return template.format(**kwargs)
    except KeyError as e:
        return template.replace("{" + str(e).strip("'") + "}", "[N/A]")
