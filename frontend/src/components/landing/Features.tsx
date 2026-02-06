'use client';

import { PhoneMissed, Clock, Zap, Cpu } from 'lucide-react';

export default function Features() {
    return (
        <section className="py-32 bg-background relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-7xl font-black mb-8 text-foreground tracking-tighter leading-[0.9]">
                        Soberanía <br className="hidden md:block" />
                        <span className="text-primary italic">Tecnológica.</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic font-medium">
                        Elimina la fricción operativa. Deja que nuestros <span className="text-foreground font-bold">sentinelas digitales</span> gestionen tu crecimiento mientras tú lideras.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    <FeatureBlock
                        icon={<PhoneMissed className="text-primary" size={36} />}
                        title="Atención Instantánea"
                        text="Tus clientes no esperan. Respuestas inteligentes y resolutivas en milisegundos, 24/7/365."
                    />
                    <FeatureBlock
                        icon={<Clock className="text-primary" size={36} />}
                        title="Disponibilidad Total"
                        text="Captura cada oportunidad. Tu negocio nunca duerme, tu facturación nunca se detiene."
                    />
                    <FeatureBlock
                        icon={<Zap className="text-primary" size={36} />}
                        title="Despliegue Agile"
                        text="Sin fricciones técnicas. Escanea, conecta y observa cómo tu infraestructura cobra vida en minutos."
                    />
                    <FeatureBlock
                        icon={<Cpu className="text-primary" size={36} />}
                        title="IA Adaptativa"
                        text="De flujos lógicos a redes neuronales. Escalamos según la complejidad de tus desafíos."
                    />
                </div>
            </div>
        </section>
    );
}

function FeatureBlock({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
    return (
        <div className="group p-10 rounded-[3rem] glass-effect border-primary/10 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
            <div className="mb-8 p-6 bg-primary/5 rounded-3xl w-fit group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-primary/5">
                {icon}
            </div>
            <h3 className="text-2xl font-black mb-4 text-foreground tracking-tight group-hover:text-primary transition-colors leading-none italic">{title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm font-medium">{text}</p>
        </div>
    );
}
