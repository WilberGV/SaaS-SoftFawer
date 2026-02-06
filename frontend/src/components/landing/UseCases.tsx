'use client';

export default function UseCases() {
    return (
        <section className="py-32 bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-7xl font-black mb-8 text-foreground tracking-tighter leading-[0.9]">
                        Escenarios de <br className="hidden md:block" />
                        <span className="text-primary italic">Impacto Real.</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium italic">
                        La eficiencia no es negociable. Diseñado para los sectores más <span className="text-foreground font-bold underline decoration-primary/30">exigentes</span> del mercado.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <UseCaseCard
                        icon="🏥"
                        title="Sector Salud"
                        problem="Saturación administrativa por agendamientos repetitivos y ausencias no notificadas."
                        solution="Gestión autónoma de citas, clasificación de urgencias y recordatorios vía WhatsApp con 40% menos ausencias."
                    />
                    <UseCaseCard
                        icon="🍴"
                        title="Gastronomía & LifeStyle"
                        problem="Pérdida de facturación fuera de horario comercial y atención deficiente en horas pico."
                        solution="Motor de reservas 24/7 con integración de pagos y atención personalizada instantánea."
                    />
                    <UseCaseCard
                        icon="🛍️"
                        title="Real Estate & High Commerce"
                        problem="Baja tasa de conversión por tiempos de respuesta superiores a 5 minutos."
                        solution="Cualificación de leads inmediata y catálogo interactivo operativo en tiempo récord."
                    />
                </div>
            </div>
        </section>
    );
}

function UseCaseCard({ icon, title, problem, solution }: { icon: string, title: string, problem: string, solution: string }) {
    return (
        <div className="group p-10 rounded-[3rem] glass-effect border-primary/10 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
            <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-500">{icon}</div>
            <h3 className="text-3xl font-black mb-6 text-foreground tracking-tight leading-none italic">{title}</h3>

            <div className="space-y-6 mt-auto">
                <div className="p-6 bg-red-500/5 rounded-[2rem] border border-red-500/10 group-hover:bg-red-500/10 transition-colors">
                    <p className="text-[10px] font-black text-red-500 mb-2 uppercase tracking-[0.3em]">Estado Crítico</p>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed italic">{problem}</p>
                </div>

                <div className="p-6 bg-green-500/5 rounded-[2rem] border border-green-500/10 group-hover:bg-green-500/10 transition-colors">
                    <p className="text-[10px] font-black text-green-500 mb-2 uppercase tracking-[0.3em]">Estado Optimizado</p>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed italic">{solution}</p>
                </div>
            </div>
        </div>
    );
}
