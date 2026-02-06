export default function PrivacidadPage() {
    return (
        <main className="bg-background min-h-screen pt-24 relative overflow-hidden">
            {/* High-End Background Mesh */}
            <div className="absolute inset-0 bg-grid-mesh opacity-20 pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="mb-20">
                    <h1 className="text-6xl md:text-8xl font-black mb-6 text-foreground tracking-tighter leading-none">
                        PROTOCOLO DE <br />
                        <span className="text-primary italic">PRIVACIDAD.</span>
                    </h1>
                    <p className="text-sm text-muted-foreground uppercase tracking-[0.4em] font-black opacity-60">Última actualización: 4 de febrero de 2026</p>
                </div>

                <div className="glass-effect border-primary/10 rounded-[3rem] p-10 md:p-16 space-y-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-mesh opacity-5 pointer-events-none" />

                    <section className="relative z-10">
                        <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight flex items-center gap-4 italic">
                            <span className="text-primary not-italic">01.</span> Adquisición de Datos
                        </h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: "Identidad del Nodo", desc: "Nombre, email y credenciales operativas." },
                                { title: "Flujo Transaccional", desc: "Datos de suscripción vía pasarelas seguras." },
                                { title: "Métricas de Red", desc: "Logs de interacción y telemetría de bots." },
                                { title: "Huella Técnica", desc: "IP, User-Agent y cookies de sesión." }
                            ].map((item, idx) => (
                                <li key={idx} className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm font-medium italic">{item.desc}</p>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="relative z-10">
                        <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight flex items-center gap-4 italic">
                            <span className="text-primary not-italic">02.</span> Propósito Operativo
                        </h2>
                        <div className="space-y-4 text-lg text-muted-foreground font-medium italic">
                            <p>Utilizamos la información para optimizar la arquitectura del servicio, garantizar la integridad de las comunicaciones y escalar la capacidad de procesamiento de los centinelas digitales.</p>
                        </div>
                    </section>

                    <section className="relative z-10">
                        <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight flex items-center gap-4 italic">
                            <span className="text-primary not-italic">03.</span> Seguridad & Criptografía
                        </h2>
                        <div className="p-8 bg-black/20 rounded-3xl border border-primary/20 backdrop-blur-md">
                            <p className="text-muted-foreground leading-relaxed font-serif italic text-lg">
                                "Implementamos estándares de encriptación de grado militar para la protección de cada paquete de datos. El acceso a la información está restringido por protocolos de autenticación multi-capa y monitoreo continuo de anomalías."
                            </p>
                        </div>
                    </section>

                    <section className="relative z-10 pt-10 border-t border-primary/10">
                        <h2 className="text-2xl font-black mb-4 text-foreground tracking-tight">Vínculo de Privacidad</h2>
                        <p className="text-muted-foreground font-medium italic">
                            Para ejercer derechos de acceso o eliminación (RGPD):
                            <br />
                            <a href="mailto:privacidad@softfawer.com" className="text-primary hover:underline font-black not-italic text-lg block mt-2">
                                privacidad@softfawer.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
