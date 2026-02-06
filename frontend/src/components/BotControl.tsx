'use client';

import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RefreshCw, Power, PowerOff, ShieldCheck, AlertCircle, QrCode } from 'lucide-react';
import { api } from '@/lib/api';
import { logActivity } from '@/lib/logger';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface BotControlProps {
    tenantId: string;
    onStatusChange?: (status: any) => void;
}

export default function BotControl({ tenantId, onStatusChange }: BotControlProps) {
    const [status, setStatus] = useState<any>(null);
    const [qr, setQr] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [lastActivity, setLastActivity] = useState<any>(null);
    const socketRef = useRef<WebSocket | null>(null);

    const GATEWAY_WS_URL = process.env.NEXT_PUBLIC_GATEWAY_URL?.replace('http', 'ws') || 'ws://localhost:3001';

    useEffect(() => {
        // Initial status fetch
        const fetchInitialStatus = async () => {
            try {
                const data = await api.getStatus(tenantId);
                setStatus(data);
                if (data.status === 'qr' && data.qr) {
                    setQr(data.qr);
                }
            } catch (e) {
                console.error("Failed to fetch initial status", e);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialStatus();

        // WebSocket for real-time updates
        const connectWS = () => {
            const socket = new WebSocket(`${GATEWAY_WS_URL}/ws/${tenantId}`);
            socketRef.current = socket;

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setStatus(data);
                if (data.status === 'qr' && data.qr) {
                    setQr(data.qr);
                } else {
                    setQr(null);
                }
                if (onStatusChange) onStatusChange(data);
            };

            socket.onclose = () => {
                console.log("Gateway WebSocket closed. Reconnecting in 5s...");
                setTimeout(connectWS, 5000);
            };

            socket.onerror = (err) => {
                console.error("Gateway WebSocket error", err);
            };
        };

        connectWS();

        // Listen for last activity logs
        let unsubscribeLogs: () => void = () => { };
        if (db) {
            const logsQuery = query(
                collection(db, 'logs'),
                where('message', '>=', ''), // Hack to allow filtering by message content prefix if possible, but Firestore is limited.
                // Better approach: filter in-memory or use a specific tag. 
                // For now, let's just fetch the latest service="BOT" logs and filter here.
                where('service', '==', 'BOT'),
                orderBy('timestamp', 'desc'),
                limit(10)
            );

            unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
                const latest = snapshot.docs
                    .map(doc => doc.data())
                    .find(log => log.message.includes(tenantId));
                if (latest) setLastActivity(latest);
            });
        }

        return () => {
            if (socketRef.current) socketRef.current.close();
            unsubscribeLogs();
        };
    }, [tenantId, GATEWAY_WS_URL]);

    const handleConnect = async () => {
        setActionLoading(true);
        try {
            await api.connect(tenantId);
        } catch (e) {
            console.error("Connection failed", e);
        } finally {
            setActionLoading(false);
            logActivity({ level: 'info', service: 'BOT', message: `Encendido iniciado: ${tenantId}` });
        }
    };

    const handleDisconnect = async () => {
        setActionLoading(true);
        try {
            await api.disconnect(tenantId);
        } catch (e) {
            console.error("Disconnection failed", e);
        } finally {
            setActionLoading(false);
            logActivity({ level: 'warn', service: 'BOT', message: `Apagado iniciado: ${tenantId}` });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 gap-4">
                <RefreshCw size={24} className="animate-spin text-primary/50" />
                <span className="text-[10px] uppercase font-black tracking-widest opacity-50">Localizando Instancia...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${status?.status === 'online' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse' :
                        status?.status === 'qr' ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]' :
                            'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]'
                        }`} />
                    <div>
                        <div className="text-xs font-black uppercase tracking-tight">
                            {status?.status === 'online' ? 'Bot Operativo' :
                                status?.status === 'qr' ? 'Esperando Escaneo' :
                                    status?.status === 'connecting' ? 'Conectando...' : 'Desconectado'}
                        </div>
                        <div className="text-[10px] text-muted-foreground italic">
                            ID: {tenantId}
                        </div>
                    </div>
                </div>


                <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-2">
                        {status?.status === 'online' ? (
                            <button
                                onClick={handleDisconnect}
                                disabled={actionLoading}
                                className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter"
                            >
                                <PowerOff size={14} />
                                Apagar
                            </button>
                        ) : (
                            <button
                                onClick={handleConnect}
                                disabled={actionLoading}
                                className="p-2 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500/20 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter"
                            >
                                <Power size={14} />
                                Encender
                            </button>
                        )}
                    </div>
                    {lastActivity && (
                        <div className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground opacity-50 italic">
                            Alt: {new Date(lastActivity.timestamp?.toDate ? lastActivity.timestamp.toDate() : lastActivity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {status?.status === 'qr' && qr && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center gap-4 p-8 glass-effect rounded-[2rem] border-primary/20 bg-primary/5"
                    >
                        <div className="bg-white p-4 rounded-3xl shadow-2xl">
                            <QRCodeSVG value={qr} size={200} />
                        </div>
                        <div className="text-center">
                            <h4 className="text-sm font-bold flex items-center justify-center gap-2 mb-1">
                                <QrCode size={16} className="text-primary" />
                                Escanea el Código
                            </h4>
                            <p className="text-[10px] text-muted-foreground italic px-4">
                                Abre WhatsApp en tu dispositivo, ve a Dispositivos Vinculados y escanea este código.
                            </p>
                        </div>
                    </motion.div>
                )}

                {status?.status === 'online' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 glass-effect rounded-2xl border-green-500/20 bg-green-500/5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 rounded-xl">
                                <ShieldCheck size={20} className="text-green-500" />
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase tracking-tight text-green-600 dark:text-green-400">Todo en orden</div>
                                <p className="text-[10px] text-muted-foreground italic">Tu bot está respondiendo mensajes activamente.</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {status?.status === 'offline' && !actionLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 glass-effect rounded-2xl border-primary/10 bg-black/10 text-center flex flex-col items-center gap-3"
                    >
                        <AlertCircle size={24} className="opacity-20" />
                        <p className="text-[10px] text-muted-foreground italic max-w-[200px]">
                            El bot está apagado. Pulsa "Encender" para generar un nuevo código QR o reconectar.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
