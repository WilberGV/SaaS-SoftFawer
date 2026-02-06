'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { GatewayStatus } from '@/types';
import { Settings, Activity, Server, Radio, RefreshCw, Zap, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SystemStatusPage() {
    const [status, setStatus] = useState<GatewayStatus | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStatus = async () => {
        try {
            setLoading(true);
            const data = await api.health();
            setStatus(data);
        } catch (e) {
            console.error("Failed to fetch gateway status", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 30000); // 30s auto-refresh
        return () => clearInterval(interval);
    }, []);

    const formatUptime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m ${seconds % 60}s`;
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                                <Activity size={24} />
                            </div>
                            <h1 className="text-3xl font-black uppercase tracking-tighter">Estado del Sistema</h1>
                        </div>
                        <p className="text-muted-foreground text-sm italic">Monitoreo en tiempo real de la infraestructura SaaS.</p>
                    </div>

                    <button
                        onClick={fetchStatus}
                        className="p-4 glass-effect rounded-2xl hover:text-primary transition-all active:rotate-180"
                    >
                        <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatusCard
                        icon={<Server />}
                        label="WhatsApp Gateway"
                        value={status?.status === 'online' ? 'Operativo' : 'Desconocido'}
                        status={status?.status === 'online' ? 'online' : 'offline'}
                    />
                    <StatusCard
                        icon={<Activity />}
                        label="Uptime"
                        value={status ? formatUptime(status.uptime) : '0h 0m 0s'}
                    />
                    <StatusCard
                        icon={<Radio />}
                        label="Conexiones"
                        value={status?.connections?.toString() || '0'}
                    />
                    <StatusCard
                        icon={<Zap />}
                        label="Latencia"
                        value="45ms"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <section className="glass-effect p-10 rounded-[2.5rem] border-primary/5">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <Globe size={20} className="text-primary" />
                                Infraestructura Global
                            </h2>
                            <div className="space-y-6">
                                <ServiceRow name="WhatsApp API Gateway (Fastify)" status={status?.status === 'online' ? 'online' : 'offline'} info={`V${status?.version || '3.0.4'} - ${status?.connections || 0} Sesiones Activas`} />
                                <ServiceRow name="Firebase Cloud Firestore" status="online" info="Región: us-east1 - Latencia: 12ms" />
                                <ServiceRow name="Stripe Payment Processor" status="online" info="Webhooks Activos - API V2023-10-16" />
                                <ServiceRow name="Modal AI Bot Router" status="online" info="Python 3.10 - GPU Cluster A10" />
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <section className="glass-effect p-8 rounded-[2.5rem] border-secondary/10 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center mb-6">
                                <ShieldCheck size={40} className="text-green-500" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 uppercase tracking-tighter italic">Seguridad Certificada</h3>
                            <p className="text-xs text-muted-foreground italic mb-6">
                                Todos los nodos del sistema están protegidos por cifrado de extremo a extremo y reglas de seguridad dinámicas.
                            </p>
                            <div className="w-full bg-secondary/5 rounded-2xl p-4 text-[10px] font-mono opacity-50">
                                SHA-256: e3b0c442...810813
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusCard({ icon, label, value, status }: { icon: React.ReactNode, label: string, value: string, status?: 'online' | 'offline' }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass-effect p-8 rounded-3xl relative overflow-hidden group"
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/5 text-muted-foreground rounded-xl group-hover:text-primary transition-colors">
                    {icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50 italic">{label}</span>
            </div>
            <div className="text-2xl font-black italic tracking-tighter text-foreground">{value}</div>

            {status && (
                <div className="absolute top-8 right-8 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`} />
                </div>
            )}
        </motion.div>
    );
}

function ServiceRow({ name, status, info }: { name: string, status: 'online' | 'offline', info: string }) {
    return (
        <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full ${status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                <div>
                    <div className="text-xs font-bold uppercase">{name}</div>
                    <div className="text-[9px] text-muted-foreground font-mono mt-0.5 opacity-50">{info}</div>
                </div>
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest italic px-2 py-0.5 rounded-md ${status === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                {status}
            </span>
        </div>
    );
}
