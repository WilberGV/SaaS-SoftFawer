import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { config } from 'dotenv';
import { WhatsAppService } from './services/whatsapp.js';
import { SessionManager } from './services/session-manager.js';
import { registerRoutes } from './routes/index.js';

config();

const fastify = Fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true
            }
        }
    }
});

// Services
const sessionManager = new SessionManager(process.env.SESSION_DIR || './sessions');
const whatsappService = new WhatsAppService(sessionManager);

// Plugins
await fastify.register(cors, { origin: true });
await fastify.register(websocket);

// Routes
registerRoutes(fastify, whatsappService, sessionManager);

// Start server
const start = async () => {
    try {
        const port = parseInt(process.env.PORT || '3001');
        const host = process.env.HOST || '0.0.0.0';

        await fastify.listen({ port, host });
        fastify.log.info(`🚀 Gateway running at http://${host}:${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
