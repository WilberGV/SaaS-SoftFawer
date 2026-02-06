export default function CookiesPage() {
    return (
        <main className="bg-background min-h-screen pt-24 relative overflow-hidden">
            {/* High-End Background Mesh */}
            <div className="absolute inset-0 bg-grid-mesh opacity-20 pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="mb-20">
                    <h1 className="text-6xl md:text-8xl font-black mb-6 text-foreground tracking-tighter leading-none">
                        RASTREO DE <br />
                        <span className="text-primary italic">COOKIES.</span>
                    </h1>
                    <p className="text-sm text-muted-foreground uppercase tracking-[0.4em] font-black opacity-60">Última actualización: 4 de febrero de 2026</p>
                </div>

                <div className="glass-effect border-primary/10 rounded-[3rem] p-10 md:p-16 space-y-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-mesh opacity-5 pointer-events-none" />

                    <section className="relative z-10">
                        <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight flex items-center gap-4 italic">
                            <span className="text-primary not-italic">01.</span> ¿Qué son las Cookies?
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed font-medium italic">
                            Las cookies son micro-paquetes de datos que los sistemas web envían a tu terminal para optimizar la latencia y personalizar la arquitectura de la sesión. Permiten que la plataforma reconozca tus parámetros operativos únicos.
                        </p>
                    </section>

                    <section className="relative z-10">
                        <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight flex items-center gap-4 italic">
                            <span className="text-primary not-italic">02.</span> Clasificación Técnica
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { title: "Infraestructura", desc: "Esenciales para el control de tráfico e identidad de sesión." },
                                { title: "Personalización", desc: "Recuerdan tu configuración regional y parámetros de IA." },
                                { title: "Analítica Neuronal", desc: "Cuantifican el flujo de usuarios para optimizar el frontend." },
                                { title: "Publicidad Lógica", desc: "Gestionan la relevancia de las ofertas en el marketplace." }
                            ].map((item, idx) => (
                                <div key={idx} className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-2 italic underline decoration-primary/30 decoration-2 underline-offset-4">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm font-medium">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="relative z-10">
                        <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight flex items-center gap-4 italic">
                            <span className="text-primary not-italic">03.</span> Gestión del Nodo
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-medium italic">
                            Puedes reconfigurar la aceptación de cookies desde tu terminal de navegación:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {["Chrome", "Firefox", "Safari", "Edge"].map(browser => (
                                <div key={browser} className="p-4 glass-effect border-primary/10 rounded-xl text-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{browser}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="relative z-10 pt-10 border-t border-primary/10">
                        <h2 className="text-2xl font-black mb-4 text-foreground tracking-tight">Vínculo de Soporte</h2>
                        <p className="text-muted-foreground font-medium italic">
                            Para dudas sobre la implementación de cookies:
                            <br />
                            <a href="mailto:soporte@softfawer.com" className="text-primary hover:underline font-black not-italic text-lg block mt-2">
                                soporte@softfawer.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
