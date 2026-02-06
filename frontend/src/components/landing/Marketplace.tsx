'use client';

import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function Marketplace() {
    return (
        <section id="marketplace" className="relative py-32 bg-background">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl glass-effect border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Marketplace de Agentes
                    </div>
                    <h2 className="text-4xl md:text-8xl font-black text-foreground mb-8 tracking-tighter leading-[0.9]">
                        Fuerza de <br />
                        <span className="text-primary italic">Trabajo Digital.</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic font-medium">
                        Modelos pre-entrenados listos para la <span className="text-foreground font-bold underline decoration-primary/30 text-2xl">acción inmediata</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {products.slice(0, 3).map((product, index) => (
                        <div key={product.id} className={index === 0 ? "md:col-span-2 lg:col-span-2" : ""}>
                            <ProductCard product={product} isFeatured={index === 0} />
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <Link href="/marketplace" className="inline-flex items-center gap-3 glass-effect px-10 py-5 rounded-[2rem] border-primary/20 text-foreground font-black hover:bg-primary hover:text-white transition-all hover:scale-105 shadow-xl shadow-primary/5">
                        Explorar Catálogo Completo
                        <span className="text-xl">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

import Link from 'next/link';
