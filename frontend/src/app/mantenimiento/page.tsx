'use client';

import { ShieldAlert, Clock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md"
            >
                <div className="relative mb-8 inline-block">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <ShieldAlert size={80} className="text-primary relative z-10 animate-pulse" />
                </div>

                <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 leading-none">
                    Mantenimiento <br />
                    <span className="text-primary italic">Programado</span>
                </h1>

                <p className="text-muted-foreground mb-8 italic">
                    Estamos realizando mejoras críticas en nuestra infraestructura para ofrecerte la mejor experiencia de IA.
                </p>

                <div className="grid grid-cols-1 gap-4 mb-10">
                    <div className="glass-effect p-4 rounded-2xl flex items-center gap-4 text-left">
                        <Clock className="text-primary" size={24} />
                        <div>
                            <div className="text-[10px] font-black uppercase opacity-50">Tiempo estimado</div>
                            <div className="text-sm font-bold">~ 2 horas</div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40">¿Necesitas ayuda urgente?</p>
                    <a
                        href="mailto:support@softfawer.com"
                        className="flex items-center gap-2 px-6 py-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-all font-bold text-sm"
                    >
                        <Mail size={16} />
                        support@softfawer.com
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
