'use client';

import { QrCode, Sliders, MessageSquare } from 'lucide-react';

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-32 bg-background relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-8xl font-black mb-8 text-foreground tracking-tighter leading-[0.9]">
                        Protocolo de <br />
                        <span className="text-primary italic">Despliegue.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                    {/* High-End Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-20 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0 overflow-hidden">
                        <div className="h-full bg-primary w-2/3 animate-shimmer" />
                    </div>

                    <Step
                        number="01"
                        icon={<QrCode size={32} />}
                        title="Vínculo Neuronal"
                        text="Sincronización inmediata vía QR. Sin fricción. Tu infraestructura actual se vuelve autónoma."
                    />
                    <Step
                        number="02"
                        icon={<Sliders size={32} />}
                        title="Configuración Lógica"
                        text="Define los parámetros de éxito. Nuestro motor procesa tus reglas en tiempo real."
                    />
                    <Step
                        number="03"
                        icon={<MessageSquare size={32} />}
                        title="Operación Autónoma"
                        text="El sistema asume el control. Monitoriza el rendimiento desde el núcleo central."
                    />
                </div>

                {/* Visual Demo Indicator */}
                <div className="mt-32 relative">
                    <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full scale-150 opacity-20" />
                    <div className="relative glass-effect rounded-[4rem] border-white/10 overflow-hidden shadow-2xl p-4 md:p-8">
                        <div className="aspect-video bg-black/40 rounded-[3rem] border border-white/5 flex items-center justify-center relative group overflow-hidden">
                            <div className="absolute inset-0 bg-grid-mesh opacity-20" />
                            <div className="z-10 flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full glass-effect flex items-center justify-center border-white/20 hover:scale-110 transition-transform cursor-pointer group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-current border-b-[10px] border-b-transparent ml-1" />
                                </div>
                                <p className="mt-6 text-[10px] text-zinc-500 font-black uppercase tracking-[0.5em]">Ver Protocolo de Operación</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Step({ number, icon, title, text }: { number: string, icon: React.ReactNode, title: string, text: string }) {
    return (
        <div className="relative z-10 flex flex-col items-center text-center group">
            <div className="w-32 h-32 rounded-[2.5rem] glass-effect border-primary/20 shadow-2xl flex items-center justify-center mb-8 relative group-hover:rotate-6 transition-transform duration-500">
                <div className="absolute inset-4 rounded-3xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    {icon}
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 glass-effect rounded-2xl flex items-center justify-center border-primary/30 shadow-xl">
                    <span className="text-xs font-black text-primary italic tracking-widest">{number}</span>
                </div>
            </div>

            <h3 className="text-2xl font-black mb-4 text-foreground tracking-tight italic">{title}</h3>
            <p className="text-muted-foreground max-w-xs text-sm font-medium leading-relaxed">{text}</p>
        </div>
    );
}
