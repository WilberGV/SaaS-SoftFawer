'use client';

import { Zap, Ban, Lock } from 'lucide-react';

export default function Guarantee() {
    return (
        <section className="py-32 bg-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-7xl font-black mb-8 text-foreground tracking-tighter leading-[0.9]">
                        Infraestructura <br className="hidden md:block" />
                        <span className="text-primary italic">Sin Compromisos.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <PromiseCard
                        icon={<Zap size={36} className="text-primary" />}
                        title="Velocidad Terminal"
                        text="De cero a funcional en 5 minutos. Sin instalaciones, sin código, sin esperas administrativas."
                    />
                    <PromiseCard
                        icon={<Ban size={36} className="text-primary" />}
                        title="Libertad Total"
                        text="Sistema sin permanencia. Control absoluto sobre tus suscripciones desde el panel central."
                    />
                    <PromiseCard
                        icon={<Lock size={36} className="text-primary" />}
                        title="Arquitectura Segura"
                        text="Datos blindados en Google Cloud EU. RGPD Compliant. Tu privacidad es nuestro estándar."
                    />
                </div>
            </div>
        </section>
    );
}

function PromiseCard({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
    return (
        <div className="group flex flex-col items-center text-center p-10 rounded-[3rem] glass-effect border-primary/5 hover:border-primary/20 transition-all duration-500">
            <div className="mb-8 p-6 bg-primary/5 rounded-3xl w-fit group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-primary/5">
                {icon}
            </div>
            <h3 className="text-2xl font-black mb-4 text-foreground tracking-tight italic">{title}</h3>
            <p className="text-muted-foreground font-medium leading-relaxed italic text-sm">{text}</p>
        </div>
    );
}
