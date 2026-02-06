import { Target, Users, Zap } from 'lucide-react';

export default function NosotrosPage() {
    return (
        <main className="bg-background min-h-screen pt-24 relative overflow-hidden">
            {/* High-End Background Mesh */}
            <div className="absolute inset-0 bg-grid-mesh opacity-20 pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="text-center mb-24">
                    <h1 className="text-6xl md:text-9xl font-black mb-8 text-foreground tracking-tighter leading-[0.8]">
                        SOFTFAWER <br />
                        <span className="text-primary italic">ENGINEERING.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto italic font-medium">
                        Forjando el futuro de la <span className="text-foreground font-bold underline decoration-primary/30">infraestructura autónoma</span>.
                    </p>
                </div>

                <div className="glass-effect border-primary/10 rounded-[4rem] p-12 md:p-20 mb-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-mesh opacity-10 pointer-events-none" />
                    <div className="max-w-3xl relative z-10">
                        <h2 className="text-4xl font-black mb-8 text-foreground tracking-tight underline decoration-primary/30 decoration-8 underline-offset-8">Génesis del Proyecto</h2>
                        <div className="space-y-6 text-xl text-muted-foreground leading-relaxed font-serif italic">
                            <p>
                                SoftFawer nació en la intersección de la necesidad operativa y la ambición tecnológica. Identificamos un abismo entre la complejidad de la IA y la simplicidad necesaria para la escala comercial.
                            </p>
                            <p>
                                Nuestra misión es eliminar la fricción. Construimos centinelas digitales que operan en los márgenes de la eficiencia, permitiendo que las marcas se enfoquen en la visión estratégica mientras nosotros gestionamos la ejecución táctica.
                            </p>
                            <p>
                                Hoy, SoftFawer no es solo una herramienta; es la columna vertebral de cientos de imperios digitales que exigen disponibilidad 24/7 y precisión absoluta.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
                    <ValueCard
                        icon={<Target className="text-primary" size={40} />}
                        title="Precisión"
                        text="Algoritmos diseñados para la resolución inmediata. Cero errores, máxima conversión."
                    />
                    <ValueCard
                        icon={<Users className="text-primary" size={40} />}
                        title="Escala"
                        text="Infraestructura que crece contigo. De startups a corporaciones globales."
                    />
                    <ValueCard
                        icon={<Zap className="text-primary" size={40} />}
                        title="Velocidad"
                        text="Despliegue neuronal en milisegundos. El tiempo es el activo más valioso."
                    />
                </div>

                <div className="glass-effect bg-primary/5 border-primary/20 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-mesh opacity-20 group-hover:opacity-40 transition-opacity" />
                    <h2 className="text-4xl md:text-7xl font-black mb-10 text-foreground tracking-tighter leading-none relative z-10">
                        ¿LISTO PARA EL <br />
                        <span className="text-primary italic">SIGUIENTE NIVEL?</span>
                    </h2>
                    <p className="text-xl text-muted-foreground mb-12 max-w-xl mx-auto italic font-medium relative z-10">
                        Únete a la élite que ya ha delegado su operación a la inteligencia SoftFawer.
                    </p>
                    <button className="bg-primary text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:shadow-2xl hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95 relative z-10">
                        EMPEZAR DESPLIEGUE
                    </button>
                </div>
            </div>
        </main>
    );
}

function ValueCard({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
    return (
        <div className="group p-10 rounded-[3rem] glass-effect border-primary/10 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 text-center">
            <div className="bg-primary/5 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-primary/5">
                {icon}
            </div>
            <h3 className="text-3xl font-black mb-4 text-foreground tracking-tight italic">{title}</h3>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed">{text}</p>
        </div>
    );
}
