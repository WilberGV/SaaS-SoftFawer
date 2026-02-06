'use client';

import * as React from 'react';
import { motion, Variants } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring' as const, stiffness: 50, damping: 20 }
    },
};

export default function MarketplaceContent({ products }: { products: Product[] }) {
    return (
        <div className="min-h-screen bg-background pt-24 pb-20 relative overflow-hidden">
            {/* Mesh Background */}
            <div className="absolute inset-x-0 top-0 h-[500px] bg-grid-mesh opacity-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    className="text-center mb-24"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl glass-effect border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                        </span>
                        Software Intelligence Hub
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-6xl md:text-9xl font-black text-foreground mb-8 tracking-tighter leading-[0.8]"
                    >
                        ENGINE <br />
                        <span className="text-primary italic">MARKET.</span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium italic"
                    >
                        Despliega infraestructura de IA pre-entrenada <br />
                        en cuestión de <span className="text-foreground font-bold underline decoration-primary/30">milisegundos</span>.
                    </motion.p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {products.map((product, index) => (
                        <motion.div key={product.id} variants={itemVariants} className={index === 0 ? "md:col-span-2 lg:col-span-2" : ""}>
                            <ProductCard product={product} isFeatured={index === 0} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
