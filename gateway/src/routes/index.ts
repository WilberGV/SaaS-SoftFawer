import { FastifyInstance } from 'fastify';
import { WhatsAppService } from '../services/whatsapp.js';
import { SessionManager } from '../services/session-manager.js';

export function registerRoutes(
    fastify: FastifyInstance,
    whatsapp: WhatsAppService,
    sessions: SessionManager
): void {
    // Health check
    fastify.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });

    // Connect WhatsApp for a tenant
    fastify.post<{ Params: { tenantId: string } }>(
        '/connect/:tenantId',
        async (request, reply) => {
            const { tenantId } = request.params;

            try {
                await whatsapp.connect(tenantId);
                return { success: true, message: `Connecting tenant ${tenantId}` };
            } catch (error) {
                reply.status(500);
                return { success: false, error: (error as Error).message };
            }
        }
    );

    // Disconnect WhatsApp for a tenant
    fastify.post<{ Params: { tenantId: string } }>(
        '/disconnect/:tenantId',
        async (request, reply) => {
            const { tenantId } = request.params;

            try {
                await whatsapp.disconnect(tenantId);
                return { success: true, message: `Disconnected tenant ${tenantId}` };
            } catch (error) {
                reply.status(500);
                return { success: false, error: (error as Error).message };
            }
        }
    );

    // Get connection status
    fastify.get<{ Params: { tenantId: string } }>(
        '/status/:tenantId',
        async (request) => {
            const { tenantId } = request.params;
            return whatsapp.getStatus(tenantId);
        }
    );

    // Send message
    fastify.post<{
        Params: { tenantId: string };
        Body: { to: string; message: string };
    }>(
        '/send/:tenantId',
        async (request, reply) => {
            const { tenantId } = request.params;
            const { to, message } = request.body;

            try {
                await whatsapp.sendMessage(tenantId, to, message);
                return { success: true };
            } catch (error) {
                reply.status(500);
                return { success: false, error: (error as Error).message };
            }
        }
    );

    // List all active sessions
    fastify.get('/sessions', async () => {
        return {
            sessions: sessions.listSessions().map(tenantId => ({
                tenantId,
                connected: whatsapp.isConnected(tenantId),
                status: whatsapp.getStatus(tenantId)
            }))
        };
    });

    // WebSocket for real-time QR code updates
    fastify.get<{ Params: { tenantId: string } }>(
        '/ws/:tenantId',
        { websocket: true },
        (socket, request) => {
            const tenantId = request.params.tenantId;

            whatsapp.onStatusChange(tenantId, (status) => {
                socket.send(JSON.stringify(status));
            });

            socket.on('message', async (data: Buffer) => {
                const message = JSON.parse(data.toString());
                if (message.action === 'connect') {
                    await whatsapp.connect(tenantId);
                }
            });
        }
    );
}
