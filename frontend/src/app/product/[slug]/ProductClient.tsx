'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Check, Zap, ShieldCheck, Clock } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

interface ProductClientProps {
    product: Product;
}

export default function ProductClient({ product }: ProductClientProps) {
    const { addToCart } = useCart();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Visual Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
            >
                <div className="aspect-[4/5] lg:aspect-square rounded-[3rem] overflow-hidden glass-effect border-primary/10 shadow-2xl relative group">
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
                    <Image
                        src={product.image || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    {product.badge && (
                        <div className="absolute top-8 right-8 bg-primary text-primary-foreground px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-2xl shadow-primary/40">
                            {product.badge}
                        </div>
                    )}
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-6 mt-12">
                    <TrustBadge icon={<ShieldCheck size={20} />} label="Seguro" />
                    <TrustBadge icon={<Zap size={20} />} label="Rápido" />
                    <TrustBadge icon={<Clock size={20} />} label="24/7" />
                </div>
            </motion.div>

            {/* Content Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-10"
            >
                <div>
                    <h1 className="text-6xl md:text-8xl font-black text-foreground mb-6 tracking-tighter leading-none italic">
                        {product.name.split(' ').map((word: string, i: number) => (
                            <React.Fragment key={i}>
                                {i > 0 && <br />}
                                {word}
                            </React.Fragment>
                        ))}
                    </h1>
                    <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-black text-primary italic underline decoration-primary/30 decoration-4 underline-offset-8">
                            {product.price}€
                        </span>
                        <span className="text-muted-foreground font-black text-sm uppercase tracking-widest">/ mes</span>
                    </div>
                </div>

                <p className="text-xl text-muted-foreground leading-relaxed font-medium italic max-w-xl">
                    {product.description}
                </p>

                <div className="glass-effect border-primary/10 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-mesh opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-500" />
                    <h3 className="text-2xl font-black text-foreground mb-8 tracking-tight italic uppercase">
                        Especificaciones <span className="text-primary not-italic">Técnicas</span>
                    </h3>
                    <ul className="grid grid-cols-1 gap-6">
                        {(product.features || []).map((feature: string, i: number) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + (i * 0.1) }}
                                className="flex items-center gap-5 text-muted-foreground group/item"
                            >
                                <div className="p-2 bg-primary/10 rounded-xl group-hover/item:bg-primary/20 transition-colors">
                                    <Check size={18} className="text-primary" />
                                </div>
                                <span className="text-lg font-bold italic group-hover/item:text-foreground transition-colors">{feature}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>

                <div className="pt-6 space-y-6">
                    <Button
                        onClick={() => addToCart(product)}
                        size="lg"
                        className="w-full h-20 text-xl font-black rounded-[2rem] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] hover:shadow-primary/50 group uppercase tracking-tighter"
                    >
                        <ShoppingCart className="mr-4 group-hover:rotate-12 transition-transform" size={24} />
                        Adquirir Nodo de Operación
                    </Button>

                    {product.roi && (
                        <div className="flex items-center justify-center gap-3">
                            <div className="h-px w-8 bg-primary/30" />
                            <p className="text-sm font-black uppercase tracking-[0.3em] text-primary animate-pulse">
                                {product.roi}
                            </p>
                            <div className="h-px w-8 bg-primary/30" />
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="flex flex-col items-center gap-3 p-6 rounded-[2rem] glass-effect border-primary/10 hover:border-primary/30 transition-colors group">
            <div className="text-primary group-hover:scale-110 transition-transform">{icon}</div>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
        </div>
    );
}
