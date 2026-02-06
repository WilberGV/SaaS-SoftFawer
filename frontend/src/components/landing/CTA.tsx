'use client';

import Link from 'next/link';

export default function CTA() {
    return (
        <section className="py-32 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#09090B]" />
            <div className="absolute inset-0 bg-grid-mesh opacity-20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full group-hover:scale-110 transition-transform duration-1000" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <h2 className="text-5xl md:text-8xl font-black mb-8 text-white tracking-tighter leading-[0.9]">
                    Tu Futuro es <br />
                    <span className="text-primary italic">Autónomo.</span>
                </h2>
                <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto font-medium italic">
                    Únete a la élite que ya opera con <span className="text-white font-bold underline decoration-primary/50 underline-offset-8">infraestructura invisible</span>.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-8">
                    <Link href="/marketplace" className="px-12 py-5 bg-primary hover:bg-primary/90 text-white rounded-[2rem] font-black text-lg transition-all hover:scale-105 shadow-2xl shadow-primary/30 active:scale-95 group/btn">
                        Desplegar IA
                        <span className="inline-block ml-2 group-hover/btn:translate-x-1 transition-transform">→</span>
                    </Link>
                    <Link href="/contacto" className="px-12 py-5 glass-effect bg-white/5 hover:bg-white/10 text-white rounded-[2rem] font-black text-lg transition-all hover:scale-105 active:scale-95 border-white/10">
                        Hablar con Expertos
                    </Link>
                </div>

                <div className="mt-20 pt-10 border-t border-white/5 opacity-40">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.5em] font-black">Powered by SoftFawer Neural Engine v2.0</p>
                </div>
            </div>
        </section>
    );
}
