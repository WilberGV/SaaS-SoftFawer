import ContactForm from '@/components/ContactForm';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export default function ContactoPage() {
    return (
        <main className="bg-background min-h-screen pt-24 relative overflow-hidden">
            {/* High-End Background Mesh */}
            <div className="absolute inset-0 bg-grid-mesh opacity-20 pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="text-center mb-24">
                    <h1 className="text-6xl md:text-9xl font-black mb-8 text-foreground tracking-tighter leading-[0.8]">
                        CORTEX <br />
                        <span className="text-primary italic">CONTACT.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto italic font-medium">
                        Canal directo con la <span className="text-foreground font-bold underline decoration-primary/30">central operativa</span>. Resolvemos tus dudas en tiempo real.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div className="glass-effect border-primary/10 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-mesh opacity-5 pointer-events-none" />
                        <h2 className="text-3xl font-black mb-10 text-foreground tracking-tight italic">
                            Canal de Comunicación
                        </h2>
                        <ContactForm />
                    </div>

                    <div className="space-y-10">
                        <div className="glass-effect border-primary/10 rounded-[3rem] p-10 md:p-14 shadow-2xl">
                            <h2 className="text-2xl font-black mb-10 text-foreground tracking-tight uppercase tracking-[0.2em] border-l-4 border-primary pl-6">
                                Coordenadas
                            </h2>

                            <div className="space-y-10">
                                <ContactInfoItem
                                    icon={<Mail className="text-primary" size={24} />}
                                    title="Protocolo Digital"
                                    value="hola@softfawer.com"
                                />
                                <ContactInfoItem
                                    icon={<Phone className="text-primary" size={24} />}
                                    title="Línea Directa"
                                    value="+34 900 123 456"
                                />
                                <ContactInfoItem
                                    icon={<MapPin className="text-primary" size={24} />}
                                    title="Núcleo Físico"
                                    value="Calle Innovación 123, Madrid"
                                />
                            </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/20 rounded-[3rem] p-10 md:p-14 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-grid-mesh opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="flex items-center gap-6 mb-8">
                                <div className="p-5 bg-primary/10 rounded-2xl">
                                    <MessageSquare className="text-primary" size={32} />
                                </div>
                                <div>
                                    <h3 className="font-black text-2xl text-foreground italic">¿URGENCIA OPERATIVA?</h3>
                                    <p className="text-muted-foreground text-sm font-medium">Respuesta inmediata vía WhatsApp</p>
                                </div>
                            </div>
                            <button className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                ABRIR CANAL WHATSAPP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function ContactInfoItem({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
    return (
        <div className="flex items-start gap-6 group">
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                {icon}
            </div>
            <div>
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">{title}</h3>
                <p className="text-lg text-foreground font-bold italic">{value}</p>
            </div>
        </div>
    );
}
