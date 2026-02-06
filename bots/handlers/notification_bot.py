"""
Notification Bot Handler
Handles appointment reminders, order updates, and simple confirmations
"""

from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta


class NotificationType:
    """Types of notifications"""
    REMINDER_24H = "reminder_24h"
    REMINDER_1H = "reminder_1h"
    ORDER_SHIPPED = "order_shipped"
    ORDER_DELIVERED = "order_delivered"
    PAYMENT_RECEIVED = "payment_received"
    PAYMENT_DUE = "payment_due"
    CUSTOM = "custom"


async def handle_notification_bot(
    event: Any,
    service_config: Dict[str, Any],
    db: Any
) -> Dict[str, Any]:
    """
    Handle notification bot conversations.
    
    This bot primarily receives responses to outgoing notifications
    and handles simple confirmations.
    
    Features:
    - Appointment confirmation/cancellation
    - Order delivery confirmation
    - Payment confirmation
    - Rating collection
    
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
    
    # Get conversation context
    conv_ref = db.collection("tenants").document(event.tenantId)\
                  .collection("conversations").document(event.from_)
    conv_doc = conv_ref.get()
    
    conv_data = conv_doc.to_dict() if conv_doc.exists else {}
    pending_action = conv_data.get("pending_notification_action")
    context = conv_data.get("notification_context", {})
    
    # Handle appointment confirmation
    if pending_action == "confirm_appointment":
        appointment_id = context.get("appointment_id")
        
        if text_lower in ["1", "si", "confirmo", "confirmar"]:
            # Update appointment status
            if appointment_id:
                apt_ref = db.collection("tenants").document(event.tenantId)\
                           .collection("appointments").document(appointment_id)
                apt_ref.update({"confirmed": True, "confirmed_at": datetime.utcnow()})
            
            conv_ref.set({
                "pending_notification_action": None,
                "notification_context": {},
                "updated_at": datetime.utcnow()
            }, merge=True)
            
            return {
                "reply_text": (
                    "Cita confirmada! Te esperamos.\n\n"
                    f"Fecha: {context.get('date', 'N/A')}\n"
                    f"Hora: {context.get('time', 'N/A')}\n\n"
                    f"Gracias por confirmar!"
                ),
                "meta": {
                    "handler": "notification_bot",
                    "action": "appointment_confirmed",
                    "appointment_id": appointment_id
                }
            }
        
        elif text_lower in ["2", "no", "cancelar"]:
            # Cancel appointment
            if appointment_id:
                apt_ref = db.collection("tenants").document(event.tenantId)\
                           .collection("appointments").document(appointment_id)
                apt_ref.update({"status": "cancelled", "cancelled_at": datetime.utcnow()})
            
            conv_ref.set({
                "pending_notification_action": None,
                "notification_context": {},
                "updated_at": datetime.utcnow()
            }, merge=True)
            
            return {
                "reply_text": (
                    "Tu cita ha sido cancelada.\n\n"
                    "Si deseas reagendar, escribe 'cita'."
                ),
                "meta": {
                    "handler": "notification_bot",
                    "action": "appointment_cancelled",
                    "appointment_id": appointment_id
                }
            }
    
    # Handle order rating
    if pending_action == "rate_order":
        order_id = context.get("order_id")
        
        try:
            rating = int(text)
            if 1 <= rating <= 5:
                # Save rating
                if order_id:
                    order_ref = db.collection("tenants").document(event.tenantId)\
                                 .collection("orders").document(order_id)
                    order_ref.update({"rating": rating, "rated_at": datetime.utcnow()})
                
                conv_ref.set({
                    "pending_notification_action": None,
                    "notification_context": {},
                    "updated_at": datetime.utcnow()
                }, merge=True)
                
                if rating >= 4:
                    return {
                        "reply_text": (
                            f"Gracias por tu calificacion de {rating} estrellas!\n\n"
                            "Nos alegra que hayas tenido una buena experiencia."
                        ),
                        "meta": {"handler": "notification_bot", "action": "rated", "rating": rating}
                    }
                else:
                    return {
                        "reply_text": (
                            f"Gracias por tu feedback.\n\n"
                            "Lamentamos que tu experiencia no haya sido perfecta. "
                            "Un agente te contactara para ayudarte."
                        ),
                        "meta": {"handler": "notification_bot", "action": "rated_low", "rating": rating}
                    }
        except ValueError:
            return {
                "reply_text": "Por favor califica del 1 al 5.",
                "meta": {"handler": "notification_bot", "action": "invalid_rating"}
            }
    
    # Handle payment confirmation
    if pending_action == "confirm_payment":
        payment_id = context.get("payment_id")
        
        if text_lower in ["si", "confirmo", "recibido", "ok"]:
            conv_ref.set({
                "pending_notification_action": None,
                "notification_context": {},
                "updated_at": datetime.utcnow()
            }, merge=True)
            
            return {
                "reply_text": "Gracias por confirmar!",
                "meta": {"handler": "notification_bot", "action": "payment_confirmed"}
            }
    
    # Default response for notifications bot
    return {
        "reply_text": (
            f"Hola! Este es el servicio de notificaciones de *{business_name}*.\n\n"
            "Aqui recibiras:\n"
            "- Recordatorios de citas\n"
            "- Actualizaciones de pedidos\n"
            "- Confirmaciones de pago\n\n"
            "Para otras consultas, escribe 'menu'."
        ),
        "meta": {"handler": "notification_bot", "action": "info"}
    }


# ===== OUTGOING NOTIFICATION FUNCTIONS =====
# These are called programmatically, not by user messages

async def send_appointment_reminder(
    db: Any,
    tenant_id: str,
    appointment: Dict[str, Any],
    reminder_type: str = "24h"
) -> Dict[str, Any]:
    """
    Prepare appointment reminder message.
    
    Args:
        db: Firestore client
        tenant_id: Tenant ID
        appointment: Appointment data
        reminder_type: "24h" or "1h"
        
    Returns:
        Dict with to, text, and context
    """
    phone = appointment.get("phone")
    name = appointment.get("name", "Cliente")
    date = appointment.get("date_display", appointment.get("date"))
    time = appointment.get("time")
    location = appointment.get("location", "nuestra oficina")
    
    if reminder_type == "1h":
        text = (
            f"Hola {name}! Tu cita es en 1 hora.\n\n"
            f"Hora: {time}\n"
            f"Lugar: {location}\n\n"
            "Te esperamos!"
        )
    else:
        text = (
            f"Hola {name}! Recordatorio: Tienes una cita manana.\n\n"
            f"Fecha: {date}\n"
            f"Hora: {time}\n"
            f"Lugar: {location}\n\n"
            "Confirma tu asistencia:\n"
            "1. Confirmo\n"
            "2. Necesito cancelar"
        )
    
    return {
        "to": phone,
        "text": text,
        "notification_type": f"reminder_{reminder_type}",
        "context": {
            "appointment_id": appointment.get("id"),
            "date": date,
            "time": time
        },
        "pending_action": "confirm_appointment" if reminder_type == "24h" else None
    }


async def send_order_update(
    db: Any,
    tenant_id: str,
    order: Dict[str, Any],
    update_type: str
) -> Dict[str, Any]:
    """
    Prepare order update message.
    
    Args:
        db: Firestore client
        tenant_id: Tenant ID
        order: Order data
        update_type: "shipped" or "delivered"
        
    Returns:
        Dict with to, text, and context
    """
    phone = order.get("phone")
    order_id = order.get("id", "N/A")
    
    if update_type == "shipped":
        text = (
            f"Tu pedido #{order_id} ha sido enviado!\n\n"
            f"Numero de rastreo: {order.get('tracking', 'N/A')}\n"
            f"Entrega estimada: {order.get('eta', 'En 3-5 dias')}\n\n"
            f"Rastrear: {order.get('tracking_url', '#')}"
        )
        pending_action = None
    else:
        text = (
            f"Tu pedido #{order_id} fue entregado!\n\n"
            "Gracias por tu compra.\n"
            "Calificanos del 1 al 5"
        )
        pending_action = "rate_order"
    
    return {
        "to": phone,
        "text": text,
        "notification_type": f"order_{update_type}",
        "context": {"order_id": order_id},
        "pending_action": pending_action
    }


async def send_payment_notification(
    db: Any,
    tenant_id: str,
    payment: Dict[str, Any],
    notification_type: str
) -> Dict[str, Any]:
    """
    Prepare payment notification message.
    
    Args:
        db: Firestore client
        tenant_id: Tenant ID
        payment: Payment data
        notification_type: "received" or "due"
        
    Returns:
        Dict with to, text, and context
    """
    phone = payment.get("phone")
    amount = payment.get("amount", 0)
    
    if notification_type == "received":
        text = (
            f"Pago recibido!\n\n"
            f"Monto: ${amount}\n"
            f"Referencia: {payment.get('reference', 'N/A')}\n\n"
            "Gracias por tu pago!"
        )
    else:
        text = (
            f"Recordatorio de pago\n\n"
            f"Tienes un pago pendiente de ${amount}.\n"
            f"Fecha limite: {payment.get('due_date', 'Pronto')}\n\n"
            f"Pagar ahora: {payment.get('payment_url', '#')}"
        )
    
    return {
        "to": phone,
        "text": text,
        "notification_type": f"payment_{notification_type}",
        "context": {"payment_id": payment.get("id")}
    }
