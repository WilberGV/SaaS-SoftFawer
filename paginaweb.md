Crea un proyecto completo llamado "SoftFawer", una agencia digital de automatizaciones que vende productos y servicios para transformar negocios mediante bots y automatización.

## Propuesta de Valor
Eliminamos tareas repetitivas de pequeños y medianos negocios mediante bots inteligentes, dashboards personalizados y automatizaciones, permitiendo que se enfoquen en crecer.

## Stack Tecnológico
- Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, qrcode.react, lucide-react, clsx, tailwind-merge
- Backend: Firebase Auth + Firestore + Functions
- Gateway: Node.js 20, Fastify, @whiskeysockets/baileys (WhatsApp), Docker, Nginx, Let's Encrypt (SSL)
- Bots: Python 3.11, Modal (serverless), Google Calendar API, Firestore, httpx
- Integraciones: Stripe (pagos y suscripciones), Google Calendar, SendGrid (emails)
- Hosting: Hostinger (frontend estático), VPS Arsys (gateway), Modal (bots serverless)

## Estructura de Carpetas
```
softfawer-agency/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                    # Landing page
│   │   │   ├── marketplace/                # Catálogo de productos
│   │   │   ├── producto/[slug]/           # Página individual de producto
│   │   │   ├── carrito/                    # Carrito de compras
│   │   │   ├── checkout/                   # Proceso de pago
│   │   │   └── (dashboard)/
│   │   │       ├── user/                   # Dashboard de usuario
│   │   │       └── admin/                  # Dashboard de administrador
│   │   ├── components/                     # Componentes reutilizables
│   │   ├── context/
│   │   │   └── AuthContext.tsx            # Gestión de auth
│   │   ├── lib/
│   │   │   └── firebase.ts                # Config Firebase
│   │   ├── data/
│   │   │   └── products.ts                # Catálogo de productos
│   │   └── types/                         # TypeScript types
│   ├── package.json
│   └── README.md
├── gateway/
│   ├── src/
│   │   ├── server.ts                      # Fastify server
│   │   ├── session-manager.ts             # Multi-tenant sessions
│   │   ├── whatsapp-service.ts            # WhatsApp con Baileys
│   │   ├── telegram-service.ts            # Telegram service
│   │   └── message-queue.ts               # Cola con delay anti-ban
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── README.md
├── bots/
│   ├── bots_router.py                     # FastAPI endpoint
│   ├── rules_bot_handler.py               # Bots con reglas (sin IA)
│   ├── handlers/
│   │   ├── appointments.py                # Reservas con Google Calendar
│   │   ├── reminders.py                   # Recordatorios automáticos
│   │   └── prices.py                      # Consulta de precios
│   ├── integrations/
│   │   ├── google_calendar.py             # Google Calendar API
│   │   └── firestore_client.py            # Cliente Firestore
│   └── README.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── TROUBLESHOOTING.md
└── scripts/
    ├── deploy-all.sh                      # Deploy automático
    ├── seed-products.ts                   # Seed productos a Firestore
    └── setup-stripe.sh                    # Config Stripe
```

## Catálogo de Productos y Precios (Para Latinoamérica)

### Bots WhatsApp (Suscripción Mensual)
1. Bot WhatsApp para Clínicas - 39€/mes
   - Reserva de citas con Google Calendar
   - Recordatorios automáticos 24h antes
   - Triaje de urgencias (clasifica por gravedad)
   - Seguimiento post-tratamiento
   - Lista de espera inteligente
   - Consulta de precios y servicios
   - Casos de uso: Clínicas dentales, fisioterapia, psicólogos, estética

2. Bot WhatsApp para Restaurantes - 29€/mes
   - Reservas de mesa
   - Consulta de menú y precios
   - Pedidos para recoger/delivery
   - Promociones y ofertas del día
   - Reseñas automatizadas post-visita
   - Casos de uso: Restaurantes, cafeterías, bares, food trucks

3. Bot WhatsApp para E-commerce - 49€/mes
   - Consulta de catálogo y stock
   - Proceso de compra completo
   - Seguimiento de pedidos
   - Devoluciones y cambios
   - Recuperación de carritos abandonados
   - Casos de uso: Tiendas online, marketplaces, dropshipping

4. Bot WhatsApp para Inmobiliarias - 39€/mes
   - Consulta de propiedades disponibles
   - Agendar visitas
   - Envío de fotos y videos
   - Filtrado por presupuesto/zona
   - Seguimiento de leads
   - Casos de uso: Inmobiliarias, agentes independientes

5. Bot WhatsApp Genérico (Soporte) - 19€/mes
   - Preguntas frecuentes (FAQ)
   - Horarios y ubicación
   - Derivación a humano si es necesario
   - Encuestas de satisfacción
   - Casos de uso: Soporte general, atención al cliente

### Bots Telegram (Suscripción Mensual)
1. Bot Telegram para Comunidades - 19€/mes
   - Bienvenida a nuevos miembros
   - Moderación automática (spam, insultos)
   - Encuestas y votaciones
   - Recordatorios de eventos
   - Sistema de puntos/gamificación
   - Casos de uso: Comunidades crypto, cursos online, grupos temáticos

2. Bot Telegram para Soporte - 29€/mes
   - Tickets de soporte (crear, asignar, cerrar)
   - Base de conocimiento (respuestas automáticas)
   - Escalado a agente humano
   - Notificaciones de estado
   - Casos de uso: SaaS, agencias, equipos remotos

3. Bot Telegram para E-learning - 39€/mes
   - Entrega de contenido por días
   - Quizzes y evaluaciones
   - Certificados automáticos
   - Recordatorios de lecciones
   - Casos de uso: E-learning, cursos online, academias

### Automatizaciones (Pago Único)
1. Automatización con Zapier/Make - 199€
   - Análisis de flujo actual
   - Diseño de automatización (hasta 5 apps)
   - Implementación completa
   - 1 mes de soporte
   - Ejemplos: CRM → Email → WhatsApp, Formulario → Notion → Slack

2. Automatización con n8n (Self-Hosted) - 399€
   - Instalación de n8n en tu servidor
   - Workflows ilimitados
   - Integración con tu stack
   - Capacitación del equipo

3. Integración de APIs Custom - 299€
   - Conectar 2 sistemas no compatibles
   - Sincronización bidireccional
   - Manejo de errores y logs
   - Documentación técnica

## Frontend - Páginas y Funcionalidades

### Landing Page (/)
- Hero section con propuesta de valor principal
- Sección de beneficios: eliminar tareas repetitivas, enfoque en crecimiento, soluciones escalables
- Catálogo destacado de productos (3-4 productos principales)
- Testimonios de clientes
- CTA para registro/login
- Footer con enlaces legales, redes sociales y contacto
- Animaciones suaves con Framer Motion
- Totalmente responsive con Tailwind CSS
- Selector de idioma: Español e Inglés (usando next-intl)

### Marketplace (/marketplace)
- Grid de productos con cards
- Filtros por categoría: WhatsApp, Telegram, Automatizaciones
- Filtros por precio y tipo de facturación: Suscripción, Pago único
- Buscador de productos por nombre o descripción
- Cada card muestra: imagen, nombre, precio, descripción breve, botón "Ver más"
- Carrito flotante con contador de productos
- Responsive grid (1 columna móvil, 2-3 en tablet, 4 en desktop)

### Página de Producto (/producto/[slug])
- Imagen grande o preview del producto
- Nombre y precio destacado
- Descripción completa del producto
- Lista de características/automatizaciones incluidas
- Casos de uso con iconos
- Botón "Agregar al carrito" (cambia a "Ya en el carrito" si está agregado)
- Sección de FAQs específicas del producto
- Productos relacionados al final
- Breadcrumb navigation

### Carrito (/carrito)
- Lista de productos agregados con imagen, nombre, precio
- Botón para eliminar productos individuales
- Input para aplicar cupones de descuento
- Resumen de compra: subtotal, descuentos, total
- Botón "Proceder al pago" (requiere login)
- Botón "Seguir comprando" que vuelve al marketplace
- Si el carrito está vacío, mostrar mensaje y botón al marketplace

### Checkout (/checkout)
- Formulario de datos del usuario: nombre, email, teléfono
- Selección de método de pago
- Integración con Stripe para pagos
- Soporte para pagos únicos y suscripciones mensuales
- Resumen de pedido con lista de productos
- Términos y condiciones checkbox
- Botón "Confirmar compra"
- Loading state durante procesamiento
- Página de confirmación tras compra exitosa
- Redirección automática al dashboard de usuario
- Envío de email de confirmación con SendGrid

### Dashboard de Usuario (/dashboard/user)
Protegido con Firebase Auth, solo accesible para usuarios autenticados.

**Sección: Mis Servicios**
- Muestra SOLO los servicios/productos que el usuario ha comprado
- Card por cada servicio con: nombre, estado (activo/inactivo), fecha de compra, próxima facturación (si es suscripción)
- Botón de configuración por servicio
- Si no tiene servicios, mostrar mensaje y botón al marketplace

**Sección: Inicio de Sesión de Apps**
Para servicios de WhatsApp:
- Botón "Generar QR de WhatsApp"
- Al hacer clic, llama al endpoint del gateway: POST /session/start/:tenantId
- Muestra el QR generado usando qrcode.react
- Indicador de estado de conexión: Conectando (amarillo), Conectado (verde), Desconectado (rojo)
- Botón para desconectar sesión

Para servicios de Telegram:
- Botón "Generar Código de Inicio"
- Muestra el código de autenticación
- Instrucciones paso a paso para vincular el bot de Telegram
- Indicador de estado de conexión

**Sección: Panel de Control por Servicio**
Al seleccionar un servicio activo:
- Estadísticas básicas: mensajes enviados hoy, mensajes recibidos hoy, usuarios activos
- Configuración del bot: switches para activar/desactivar funciones específicas
- Logs recientes de actividad (últimos 10 eventos)
- Integraciones activas (Google Calendar, etc.)

**Sección: Configuración de Integraciones**
- Google Calendar: Botón "Conectar Google Calendar" con OAuth flow
- Webhook URL personalizada para integraciones custom
- API Key generada automáticamente (con botón copiar)
- Documentación de API

**Sección: Facturación y Suscripciones**
- Historial de facturas con descarga en PDF
- Próximos pagos programados
- Método de pago guardado (Stripe)
- Botón para actualizar método de pago
- Botón para cancelar suscripción (con confirmación)

### Dashboard de Administrador (/dashboard/admin)
Protegido con Firebase Auth + verificación de role: "admin". Si el usuario no es admin, redirigir a /dashboard/user.

**Vista General**
- Cards con KPIs: total usuarios registrados, servicios activos totales, ingresos del mes, ingresos totales
- Gráfico de crecimiento de usuarios (últimos 6 meses)
- Gráfico de ingresos (últimos 6 meses)
- Lista de últimos 5 pedidos

**Gestión de Usuarios**
- Tabla con todos los usuarios: email, nombre, plan, fecha registro, servicios activos, acciones
- Buscador por email o nombre
- Filtros por plan, fecha de registro
- Acciones por usuario: Ver detalle, Editar, Asignar servicios manualmente, Eliminar
- Botón "Crear usuario manualmente"
- Exportar lista a CSV

**Gestión de Productos**
- Tabla con todos los productos: nombre, categoría, precio, estado (activo/inactivo), acciones
- Acciones: Crear nuevo producto, Editar, Eliminar, Activar/Desactivar
- Editor visual para descripciones con markdown
- Upload de imágenes de producto

**Gestión de Pedidos**
- Tabla con todos los pedidos: ID, usuario, productos, total, estado, fecha, acciones
- Estados: Pendiente, Completado, Cancelado, Reembolsado
- Filtros por estado, fecha, usuario
- Acciones: Ver detalle, Cambiar estado, Reembolsar
- Exportar a CSV

**Gestión de Tenants/Sesiones**
- Lista de todos los tenants con sesiones activas
- Información por tenant: usuario, tipo de servicio, estado de gateway (conectado/desconectado)
- Botón para forzar desconexión de sesión
- Ver logs de cada tenant
- Estadísticas de uso por tenant

**Configuración Global**
- Formulario para editar variables de entorno críticas
- Configuración de Stripe: API keys, webhook URL
- Configuración de integraciones: OpenAI API key, SendGrid API key, Google Calendar OAuth
- Configuración de precios y descuentos globales
- Webhooks y API keys del sistema

**Analytics Avanzado**
- Uso de servicios por usuario (gráfico)
- Retención de clientes (gráfico de cohortes)
- Tasa de conversión del marketplace
- Productos más vendidos (top 5)
- Churn rate mensual

## Gateway - Endpoints y Funcionalidades

### Tecnología
- Node.js 20 con Fastify
- @whiskeysockets/baileys para WhatsApp Web
- Docker para contenedores
- Nginx como reverse proxy
- Let's Encrypt para SSL automático
- Pino para logging estructurado

### Endpoints

**POST /session/start/:tenantId**
- Inicia una nueva sesión de WhatsApp para el tenant especificado
- Genera QR code en base64 y lo devuelve
- Guarda la sesión en `./sessions/:tenantId/auth_info.json`
- Response: `{ qr: "base64_string", status: "connecting" }`
- Manejo de errores: si ya existe sesión activa, devolver error 409

**GET /session/:tenantId/status**
- Devuelve el estado actual de la sesión del tenant
- Response: `{ status: "connected" | "disconnected" | "connecting", lastSeen: timestamp }`

**POST /session/:tenantId/stop**
- Cierra la sesión de WhatsApp del tenant
- Elimina la sesión guardada
- Response: `{ success: true, message: "Session closed" }`

**POST /message/send**
- Envía mensaje de WhatsApp
- Body: `{ tenantId, to, message, mediaUrl? }`
- Usa cola de mensajes con delay de 3-5 segundos anti-ban
- Retry automático (3 intentos) en caso de error
- Response: `{ success: true, messageId: "..." }`

**POST /webhook/whatsapp**
- Recibe mensajes entrantes de WhatsApp
- Procesa el mensaje y extrae: tenantId, from, message, timestamp, mediaUrl (si hay)
- Envía webhook a Modal: `POST {MODAL_URL}/webhook/whatsapp`
- Response: `{ received: true }`
- Logging de todos los mensajes recibidos

**POST /webhook/telegram**
- Recibe mensajes entrantes de Telegram
- Procesa el mensaje y extrae: tenantId, from, message, timestamp
- Envía webhook a Modal: `POST {MODAL_URL}/webhook/telegram`
- Response: `{ received: true }`

### Gestión de Sesiones (session-manager.ts)
- Mantiene un Map<tenantId, BaileysSocket> de sesiones activas
- Reconexión automática si se desconecta (máximo 5 intentos)
- Guarda credenciales persistentes en `./sessions/:tenantId/auth_info.json`
- Limpieza automática de sesiones inactivas después de 24h
- Multi-tenant: puede manejar 100+ sesiones simultáneas

### Cola de Mensajes (message-queue.ts)
- Cola FIFO para envío de mensajes
- Delay configurable entre mensajes (default 3 segundos, configurable por tenant)
- Prioridad para mensajes urgentes
- Retry automático en caso de error (3 intentos con backoff exponencial)
- Logging de todos los intentos de envío

### Docker
- Dockerfile con Node.js 20 alpine
- docker-compose.yml con Nginx como reverse proxy
- Volumen persistente para ./sessions
- Certificados SSL con Let's Encrypt (certbot)
- Health checks cada 30 segundos

## Bots - Motor Basado en Reglas (Sin IA)

### Tecnología
- Python 3.11
- Modal para serverless
- FastAPI para webhooks
- Google Calendar API
- Firestore para persistencia
- httpx para HTTP requests
- Python logging estructurado

### Archivo Principal (bots_router.py)

Endpoint FastAPI que recibe webhooks del gateway y enruta según el tipo de servicio del tenant.

```python
from modal import App, web_endpoint, Secret
from fastapi import FastAPI, Request
import httpx

app = App("softfawer-bots")
fastapi_app = FastAPI()

@app.function(secrets=[Secret.from_name("softfawer-secrets")])
@web_endpoint(method="POST", path="/webhook/whatsapp")
async def handle_whatsapp(request: Request):
    data = await request.json()
    tenant_id = data["tenantId"]
    message = data["message"].lower().strip()
    from_number = data["from"]
    
    # Obtener config del tenant desde Firestore
    tenant_config = await get_tenant_config(tenant_id)
    service_type = tenant_config["serviceType"]
    
    # Enrutar según tipo de servicio
    if service_type == "clinica":
        response = await handle_clinica(tenant_id, from_number, message, tenant_config)
    elif service_type == "restaurante":
        response = await handle_restaurante(tenant_id, from_number, message, tenant_config)
    elif service_type == "ecommerce":
        response = await handle_ecommerce(tenant_id, from_number, message, tenant_config)
    elif service_type == "inmobiliaria":
        response = await handle_inmobiliaria(tenant_id, from_number, message, tenant_config)
    elif service_type == "soporte":
        response = await handle_soporte(tenant_id, from_number, message, tenant_config)
    
    # Enviar respuesta al gateway
    await send_whatsapp_message(tenant_id, from_number, response)
    
    return {"success": True}
```

### Handlers por Tipo de Servicio

**handlers/appointments.py (para clínicas)**

Flujo de conversación para reserva de citas:

1. **Saludo inicial** (si es primera interacción):
   - "¡Hola! Soy el asistente virtual de [NOMBRE_CLINICA]. ¿En qué puedo ayudarte?"
   - Opciones: "1️⃣ Reservar cita\n2️⃣ Consultar cita\n3️⃣ Cancelar cita\n4️⃣ Precios\n5️⃣ Ubicación"

2. **Flujo de reserva** (si usuario elige opción 1):
   - "¿Para qué especialidad necesitas la cita?" (listar especialidades disponibles)
   - Usuario selecciona especialidad
   - Consultar disponibilidad en Google Calendar API
   - "Estos son los horarios disponibles:\n🗓️ Lunes 15:00\n🗓️ Martes 10:00\n¿Cuál prefieres?"
   - Usuario selecciona horario
   - "Por favor confirma tus datos: nombre completo"
   - Usuario envía nombre
   - Crear evento en Google Calendar
   - "✅ Cita confirmada para [FECHA] a las [HORA] con [DOCTOR]. Te enviaremos un recordatorio 24h antes."
   - Guardar cita en Firestore

3. **Recordatorios automáticos**:
   - Cron job diario que revisa citas del día siguiente
   - Envía mensaje: "⏰ Recordatorio: Tienes cita mañana [FECHA] a las [HORA] con [DOCTOR] en [CLINICA]. ¡Te esperamos!"

4. **Consulta de cita**:
   - Buscar cita del usuario en Firestore
   - "Tu próxima cita es el [FECHA] a las [HORA] con [DOCTOR]."

5. **Cancelación de cita**:
   - "¿Estás seguro de cancelar tu cita del [FECHA]? Responde SÍ para confirmar."
   - Si confirma: eliminar de Google Calendar y Firestore
   - "Tu cita ha sido cancelada. ¿Deseas agendar una nueva?"

6. **Triaje de urgencias**:
   - Si mensaje contiene palabras clave: "urgencia", "emergencia", "dolor fuerte", "sangrado"
   - "⚠️ Tu caso parece urgente. Por favor llama directamente al [TELEFONO] o acude a urgencias."

**handlers/prices.py**

Implementa consulta de precios:
- Almacena precios en Firestore: `tenants/{tenantId}/prices/{priceId}`
- Estructura: `{ service: "Limpieza dental", price: 50, currency: "EUR" }`
- Si usuario pregunta "precios" o "cuánto cuesta":
  - Listar todas las categorías disponibles
  - Usuario selecciona categoría
  - Mostrar precios de esa categoría
- Búsqueda por palabra clave: si usuario pregunta "cuánto cuesta limpieza"
  - Buscar en precios que contengan "limpieza"
  - Responder con precio específico

**handlers/reminders.py**

Sistema de recordatorios:
- Cron job que se ejecuta diariamente a las 9:00 AM
- Consulta todas las citas del día siguiente en Firestore
- Envía recordatorio por WhatsApp a cada usuario
- Marca recordatorio como enviado

### Bots para Restaurantes

Flujo de conversación:

1. **Menú principal**:
   - "¡Bienvenido a [NOMBRE_RESTAURANTE]! ¿En qué puedo ayudarte?"
   - "1️⃣ Hacer reserva\n2️⃣ Ver menú\n3️⃣ Hacer pedido\n4️⃣ Promociones\n5️⃣ Ubicación"

2. **Reservas de mesa**:
   - "¿Para cuántas personas?"
   - "¿Qué día prefieres?"
   - "¿A qué hora?"
   - "Confirma tu nombre y teléfono"
   - Guardar en Firestore
   - "✅ Mesa reservada para [PERSONAS] personas el [FECHA] a las [HORA]."

3. **Consulta de menú**:
   - Almacenar menú en Firestore: `tenants/{tenantId}/menu/{itemId}`
   - "Aquí está nuestro menú:\n🍕 Pizza Margarita - 12€\n🍝 Pasta Carbonara - 10€\n..."
   - Filtros por categoría: "Ver entrantes", "Ver postres"

4. **Pedidos para recoger/delivery**:
   - Mostrar menú
   - "¿Qué deseas ordenar? (puedes enviar varios ítems)"
   - Usuario lista productos
   - "Tu pedido:\n- Pizza x2\n- Pasta x1\nTotal: 34€\n¿Confirmas?"
   - "¿Para recoger o delivery?"
   - Si delivery: pedir dirección
   - Guardar pedido en Firestore
   - "✅ Pedido confirmado. Tiempo estimado: 30-40 minutos"

5. **Promociones**:
   - Leer de Firestore: `tenants/{tenantId}/promotions/`
   - "🎉 Promociones de hoy:\n- 2x1 en pizzas\n- 20% descuento en pasta"

### Bots para E-commerce

Flujo de conversación:

1. **Menú principal**:
   - "¡Hola! Soy el asistente de [TIENDA]. ¿Qué buscas hoy?"
   - "1️⃣ Ver catálogo\n2️⃣ Buscar producto\n3️⃣ Ver carrito\n4️⃣ Estado de pedido\n5️⃣ Devoluciones"

2. **Catálogo**:
   - Leer productos de Firestore: `tenants/{tenantId}/products/`
   - "Nuestros productos:\n📱 iPhone 13 - 799€\n💻 MacBook Pro - 2499€"
   - Paginación si hay muchos productos
   - "Envía el número del producto para más info"

3. **Proceso de compra**:
   - Usuario selecciona producto
   - "📱 iPhone 13 - 799€\nStock: 10 unidades\n¿Cuántos deseas?"
   - Usuario indica cantidad
   - "Agregado al carrito. ¿Deseas agregar algo más? (SÍ/NO)"
   - Si NO: "Tu carrito:\n- iPhone 13 x2 = 1598€\nTotal: 1598€\n¿Proceder al pago?"
   - "Por favor envía:\n- Nombre completo\n- Dirección de envío\n- Método de pago (Transferencia/Contra entrega)"
   - Crear orden en Firestore
   - "✅ Pedido #12345 confirmado. Recibirás actualizaciones por aquí."

4. **Seguimiento de pedido**:
   - "Envía tu número de pedido"
   - Buscar en Firestore
   - "📦 Pedido #12345:\nEstado: En camino\nLlegada estimada: Mañana 15:00"

5. **Recuperación de carritos abandonados**:
   - Cron job que revisa carritos en Firestore sin completar (>24h)
   - Envía mensaje: "👋 Veo que dejaste productos en tu carrito. ¿Necesitas ayuda para completar tu compra?"

### Bots para Inmobiliarias

Flujo de conversación:

1. **Menú principal**:
   - "¡Bienvenido a [INMOBILIARIA]! ¿Qué buscas?"
   - "1️⃣ Ver propiedades\n2️⃣ Agendar visita\n3️⃣ Contactar agente"

2. **Consulta de propiedades**:
   - "¿Qué tipo de propiedad buscas? (Casa/Apartamento/Local)"
   - "¿En qué zona?"
   - "¿Cuál es tu presupuesto máximo?"
   - Filtrar propiedades en Firestore según criterios
   - Enviar fotos y detalles de cada propiedad
   - "🏠 Casa en Centro\n3 habitaciones, 2 baños\n150m²\n250,000€\n[FOTO]"

3. **Agendar visita**:
   - "¿Cuál propiedad te interesa? (envía el código)"
   - "¿Qué día prefieres visitar?"
   - "¿A qué hora?"
   - "Confirma tu nombre y teléfono"
   - Crear evento en Google Calendar
   - "✅ Visita agendada para [FECHA] a las [HORA]. El agente [NOMBRE] te atenderá."

### Bots Genéricos (Soporte)

Flujo de conversación:

1. **Saludo inicial**:
   - "¡Hola! Soy el asistente de [EMPRESA]. ¿En qué puedo ayudarte?"
   - "1️⃣ Preguntas frecuentes\n2️⃣ Horarios\n3️⃣ Ubicación\n4️⃣ Hablar con humano"

2. **Preguntas frecuentes**:
   - Leer de Firestore: `tenants/{tenantId}/faqs/`
   - Mostrar lista de categorías
   - Usuario selecciona categoría
   - Mostrar FAQs de esa categoría

3. **Horarios y ubicación**:
   - Leer de Firestore: `tenants/{tenantId}/settings/business_hours`
   - "📍 Ubicación: [DIRECCION]\n🕐 Horarios: Lun-Vie 9:00-18:00"

4. **Derivación a humano**:
   - "Te conectaré con un agente. Por favor describe tu consulta."
   - Crear ticket en Firestore: `tenants/{tenantId}/tickets/`
   - Notificar al equipo de soporte
   - "✅ Ticket #123 creado. Un agente te contactará pronto."

### Bots de Telegram

Similar lógica pero adaptada a Telegram Bot API:
- Usar comandos: /start, /help, /reservar, /menu
- Inline keyboards para opciones
- Stickers y emojis
- Grupos: moderación automática con filtro de palabras prohibidas

### Integración con Google Calendar (integrations/google_calendar.py)

```python
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from datetime import datetime, timedelta

async def create_appointment(tenant_id, user_name, date, time, service_type):
    # Obtener credentials del tenant desde Firestore
    credentials = await get_google_credentials(tenant_id)
    
    service = build('calendar', 'v3', credentials=credentials)
    
    event = {
        'summary': f'Cita - {user_name}',
        'description': f'Servicio: {service_type}',
        'start': {
            'dateTime': f'{date}T{time}:00',
            'timeZone': 'Europe/Madrid',
        },
        'end': {
            'dateTime': f'{date}T{time + timedelta(hours=1)}:00',
            'timeZone': 'Europe/Madrid',
        },
        'reminders': {
            'useDefault': False,
            'overrides': [
                {'method': 'popup', 'minutes': 24 * 60},
            ],
        },
    }
    
    event = service.events().insert(calendarId='primary', body=event).execute()
    return event['id']
```

## Estructura Firestore

```
users/{userId}/
  - email: string
  - name: string
  - role: "user" | "admin"
  - createdAt: timestamp
  - purchases: string[] (productIds)
  - stripeCustomerId: string

products/{productId}/
  - id: string
  - name: string
  - slug: string
  - category: "whatsapp" | "telegram" | "automatizacion"
  - price: number
  - currency: "EUR"
  - billingType: "monthly" | "one-time"
  - description: string
  - features: string[]
  - useCases: string[]
  - integrations: string[]
  - active: boolean

orders/{orderId}/
  - userId: string
  - productIds: string[]
  - total: number
  - status: "pending" | "completed" | "cancelled" | "refunded"
  - createdAt: timestamp
  - stripePaymentId: string

tenants/{tenantId}/
  - userId: string
  - productId: string
  - serviceType: "clinica" | "restaurante" | "ecommerce" | "inmobiliaria" | "soporte"
  - sessionStatus: "connected" | "disconnected" | "connecting"
  - createdAt: timestamp
  - lastActivity: timestamp
  
  services/{serviceId}/
    - type: "whatsapp" | "telegram"
    - enabled: boolean
    - config: object
  
  conversations/{conversationId}/
    - from: string (phone/telegram_id)
    - messages: [{ role: "user" | "bot", content: string, timestamp }]
    - lastMessage: timestamp
  
  prices/{priceId}/
    - service: string
    - price: number
    - currency: string
  
  menu/{itemId}/
    - name: string
    - price: number
    - category: string
    - description: string
  
  products/{productId}/
    - name: string
    - price: number
    - stock: number
    - category: string
  
  appointments/{appointmentId}/
    - userName: string
    - userPhone: string
    - date: string
    - time: string
    - serviceType: string
    - googleCalendarEventId: string
    - reminderSent: boolean
  
  settings/
    - businessName: string
    - businessHours: string
    - address: string
    - phone: string
    - googleCalendarConnected: boolean
```

## Reglas de Seguridad Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow write: if isOwner(userId) || isAdmin();
    }
    
    // Products (público para lectura)
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Orders
    match /orders/{orderId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAdmin();
    }
    
    // Tenants (multi-tenant)
    match /tenants/{tenantId} {
      allow read, write: if isOwner(resource.data.userId) || isAdmin();
      
      match /{document=**} {
        allow read, write: if isOwner(get(/databases/$(database)/documents/tenants/$(tenantId)).data.userId) || isAdmin();
      }
    }
  }
}
```

## Variables de Entorno

**Frontend (.env.local):**
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_GATEWAY_URL=https://gateway.softfawer.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_ADMIN_EMAIL=admin@softfawer.com
```

**Gateway (.env):**
```
PORT=3000
API_KEY_GLOBAL=tu_api_key_segura_aqui
WEBHOOK_URL=https://softfawer--bots-webhook.modal.run
SESSIONS_DIR=./sessions
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
```

**Modal (secrets):**
```
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
GATEWAY_URL=https://gateway.softfawer.com
GATEWAY_API_KEY=
GOOGLE_CALENDAR_CLIENT_ID=
GOOGLE_CALENDAR_CLIENT_SECRET=
SENDGRID_API_KEY=
```

## Configuración Multi-idioma

Usar `next-intl` para soporte de Español e Inglés:

**Carpetas de traducciones:**
```
frontend/src/locales/
  es.json
  en.json
```

**Ejemplo es.json:**
```json
{
  "landing": {
    "hero": {
      "title": "Elimina tareas repetitivas con automatización inteligente",
      "subtitle": "Bots de WhatsApp y Telegram para pequeños y medianos negocios"
    }
  },
  "marketplace": {
    "title": "Catálogo de Productos",
    "filters": "Filtros",
    "category": "Categoría"
  }
}
```

**Configuración en next.config.js:**
```javascript
module.exports = {
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
  },
}
```

## Scripts de Deploy

**deploy-all.sh:**
```bash
#!/bin/bash
set -e

echo "🚀 Desplegando SoftFawer..."

# Frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
rsync -avz out/ usuario@hostinger:/home/softfawer/public_html/

# Gateway
echo "🌐 Deploying gateway..."
cd ../gateway
docker-compose down
docker-compose build
docker-compose up -d

# Bots
echo "🤖 Deploying bots..."
cd ../bots
modal deploy bots_router.py

echo "✅ Deploy completo!"
```

**seed-products.ts:**
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const products = [
  // Aquí van todos los productos del catálogo
];

async function seedProducts() {
  const db = getFirestore();
  for (const product of products) {
    await setDoc(doc(db, 'products', product.id), product);
    console.log(`✅ ${product.name}`);
  }
}

seedProducts();
```

## Requisitos Técnicos Generales

1. **Manejo de Errores**: Todas las funciones deben tener try-catch y manejo de errores robusto
2. **TypeScript Estricto**: No usar `any`, definir tipos e interfaces para todo
3. **Python Type Hints**: Usar type hints en todas las funciones de Python
4. **Logging**: Implementar logging estructurado en todas las capas (Pino en Node.js, Python logging)
5. **Retry Logic**: Todas las llamadas a APIs externas deben tener retry automático (máximo 3 intentos)
6. **Validación**: Validar todos los inputs de usuario y requests
7. **Seguridad**: Variables de entorno para secretos, nunca hardcodear keys
8. **Responsive**: Todo el frontend debe ser 100% responsive (móvil first)
9. **Performance**: Optimizar imágenes, lazy loading, code splitting
10. **SEO**: Meta tags, Open Graph, sitemap.xml, robots.txt
11. **Tests**: Tests unitarios para funciones críticas (Jest para Node.js, pytest para Python)
12. **Documentación**: README.md en cada carpeta, comentarios en funciones complejas

## Notas Finales

- TODOS los bots son sin IA, basados únicamente en reglas y flujos de conversación
- El sistema es completamente multi-tenant y escalable horizontalmente
- Cada usuario solo puede ver y gestionar sus propios servicios
- El administrador tiene acceso completo a todos los datos y configuraciones
- Las integraciones (Google Calendar, Stripe, SendGrid) deben ser funcionales y con manejo de errores
- Los QR codes de WhatsApp se generan usando la librería baileys y se muestran con qrcode.react
- El sistema soporta Español e Inglés con next-intl

