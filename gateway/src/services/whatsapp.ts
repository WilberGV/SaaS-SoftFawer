import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    WASocket,
    BaileysEventMap
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import * as QRCode from 'qrcode';
import pino from 'pino';
import { SessionManager } from './session-manager.js';
import { db } from './firebase.js';
import { Timestamp } from 'firebase-admin/firestore';

export interface ConnectionStatus {
    tenantId: string;
    status: 'disconnected' | 'connecting' | 'qr' | 'connected';
    qrCode?: string;
    phoneNumber?: string;
}

type ConnectionCallback = (status: ConnectionStatus) => void;

export class WhatsAppService {
    private connections: Map<string, WASocket> = new Map();
    private connectionCallbacks: Map<string, ConnectionCallback[]> = new Map();
    private sessionManager: SessionManager;
    private logger = pino({ level: 'info' });
    private botRouterUrl: string;

    constructor(sessionManager: SessionManager) {
        this.sessionManager = sessionManager;
        this.botRouterUrl = process.env.BOT_ROUTER_URL || 'http://localhost:8000/route';
    }

    async connect(tenantId: string): Promise<void> {
        if (this.connections.has(tenantId)) {
            this.logger.info(`Tenant ${tenantId} already connected`);
            return;
        }

        const sessionPath = this.sessionManager.getSessionPath(tenantId);
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

        const socket = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            logger: pino({ level: 'silent' })
        });

        this.connections.set(tenantId, socket);

        socket.ev.on('creds.update', saveCreds);

        socket.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                const qrImage = await QRCode.toDataURL(qr);
                this.notifyCallbacks(tenantId, {
                    tenantId,
                    status: 'qr',
                    qrCode: qrImage
                });
            }

            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;

                this.connections.delete(tenantId);

                if (shouldReconnect) {
                    this.logger.info(`Reconnecting tenant ${tenantId}...`);
                    setTimeout(() => this.connect(tenantId), 3000);
                } else {
                    this.sessionManager.deleteSession(tenantId);
                    this.notifyCallbacks(tenantId, {
                        tenantId,
                        status: 'disconnected'
                    });
                }
            }

            if (connection === 'open') {
                const phoneNumber = socket.user?.id.split(':')[0];
                this.notifyCallbacks(tenantId, {
                    tenantId,
                    status: 'connected',
                    phoneNumber
                });
                this.logger.info(`Tenant ${tenantId} connected: ${phoneNumber}`);
            }
        });

        // Handle incoming messages
        socket.ev.on('messages.upsert', async ({ messages }) => {
            for (const msg of messages) {
                if (!msg.key.fromMe && msg.message) {
                    await this.handleIncomingMessage(tenantId, socket, msg);
                }
            }
        });
    }

    private async handleIncomingMessage(
        tenantId: string,
        socket: WASocket,
        msg: BaileysEventMap['messages.upsert']['messages'][0]
    ): Promise<void> {
        const from = msg.key.remoteJid;
        if (!from) return;

        const text = msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            '';

        if (!text) return;

        try {
            // Forward to bot router
            const response = await fetch(this.botRouterUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenant_id: tenantId,
                    sender: from.replace('@s.whatsapp.net', ''),
                    message: text,
                    platform: 'whatsapp',
                    message_id: msg.key.id
                })
            });

            if (response.ok) {
                const data = await response.json() as { response?: string };
                if (data.response) {
                    await socket.sendMessage(from, { text: data.response });
                }
            }

            // Log activity to Firestore
            await db.collection('logs').add({
                service: 'BOT',
                level: 'info',
                message: `[${tenantId}] Msg from ${from.replace('@s.whatsapp.net', '')}: ${text.substring(0, 50)}...`,
                timestamp: Timestamp.now(),
                metadata: {
                    tenantId,
                    from,
                    platform: 'whatsapp'
                }
            });

        } catch (error) {
            this.logger.error(`Error routing message for tenant ${tenantId}: ${error}`);

            // Log error to Firestore
            await db.collection('logs').add({
                service: 'BOT',
                level: 'error',
                message: `[${tenantId}] Error routing message: ${(error as Error).message}`,
                timestamp: Timestamp.now()
            });
        }
    }

    async disconnect(tenantId: string): Promise<void> {
        const socket = this.connections.get(tenantId);
        if (socket) {
            await socket.logout();
            this.connections.delete(tenantId);
            this.sessionManager.deleteSession(tenantId);
        }
    }

    async sendMessage(tenantId: string, to: string, message: string): Promise<boolean> {
        const socket = this.connections.get(tenantId);
        if (!socket) {
            throw new Error(`Tenant ${tenantId} not connected`);
        }

        const jid = to.includes('@') ? to : `${to}@s.whatsapp.net`;
        await socket.sendMessage(jid, { text: message });
        return true;
    }

    onStatusChange(tenantId: string, callback: ConnectionCallback): void {
        if (!this.connectionCallbacks.has(tenantId)) {
            this.connectionCallbacks.set(tenantId, []);
        }
        this.connectionCallbacks.get(tenantId)!.push(callback);
    }

    private notifyCallbacks(tenantId: string, status: ConnectionStatus): void {
        const callbacks = this.connectionCallbacks.get(tenantId) || [];
        callbacks.forEach(cb => cb(status));
    }

    getStatus(tenantId: string): ConnectionStatus {
        const socket = this.connections.get(tenantId);
        return {
            tenantId,
            status: socket ? 'connected' : 'disconnected',
            phoneNumber: socket?.user?.id.split(':')[0]
        };
    }

    isConnected(tenantId: string): boolean {
        return this.connections.has(tenantId);
    }
}
