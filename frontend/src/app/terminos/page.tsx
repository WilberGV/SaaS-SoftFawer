export default function TerminosPage() {
    return (
        <main className="bg-background min-h-screen pt-24 relative overflow-hidden">
            {/* High-End Background Mesh */}
            <div className="absolute inset-0 bg-grid-mesh opacity-20 pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="mb-20">
                    <h1 className="text-6xl md:text-8xl font-black mb-6 text-foreground tracking-tighter leading-none">
                        TÉRMINOS DE <br />
                        <span className="text-primary italic">OPERACIÓN.</span>
                    </h1>
                    <p className="text-sm text-muted-foreground uppercase tracking-[0.4em] font-black opacity-60">Última actualización: 4 de febrero de 2026</p>
                </div>

                <div className="glass-effect border-primary/10 rounded-[3rem] p-10 md:p-16 space-y-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-mesh opacity-5 pointer-events-none" />

                    <section className="relative z-10">
                        <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight flex items-center gap-4 italic">
                            <span className="text-primary not-italic">01.</span> Aceptación del Protocolo
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                            Al acceder y utilizar los servicios de SoftFawer, aceptas cumplir con estos términos y condiciones.
                            Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestros servicios.
                        </p>
                    </section>

                    <section className="relative z-10">
                        <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight flex items-center gap-4 italic">
                            <span className="text-primary not-italic">02.</span> Especificación Técnica
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-medium">
                            SoftFawer proporciona infraestructura de automatización inteligente para WhatsApp Business:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Despliegue de Redes Neuronales",
                                "Gestión Autónoma de Reservas",
                                "Procesamiento de Transacciones",
                                "Sincronización de Datos 24/7"
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    <span className="text-sm font-black uppercase tracking-widest text-foreground/80">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="relative z-10">
                        <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight flex items-center gap-4 italic">
                            <span className="text-primary not-italic">03.</span> Ética Operativa
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-medium">
                            El usuario se compromete a operar dentro de los límites de la legalidad y el fair-play digital:
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Cero tolerancia al Spam masivo",
                                "Respeto absoluto a la privacidad del cliente final",
                                "Adherencia total a las políticas de Meta/WhatsApp",
                                "Custodia diligente de credenciales de acceso"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-muted-foreground font-medium italic">
                                    <span className="text-primary font-black">→</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="relative z-10 pt-10 border-t border-primary/10">
                        <h2 className="text-2xl font-black mb-4 text-foreground tracking-tight">Vínculo de Comunicación</h2>
                        <p className="text-muted-foreground font-medium italic">
                            Para consultas legales corporativas:
                            <br />
                            <a href="mailto:legal@softfawer.com" className="text-primary hover:underline font-black not-italic text-lg block mt-2">
                                legal@softfawer.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
