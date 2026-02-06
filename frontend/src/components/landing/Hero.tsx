'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const LeadForm = dynamic(() => import('@/components/LeadForm').then(mod => mod.LeadForm), {
    loading: () => <div className="h-96 flex items-center justify-center animate-pulse bg-muted rounded-3xl" />
});

// Re-introducing safe animation variants
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
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 60, damping: 20 }
    },
};

export default function Hero() {
    // Use a state to ensure we only animate on the client after hydration
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div
            className="min-h-screen pt-20 overflow-hidden bg-background relative z-10"
            suppressHydrationWarning
        >

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-grid-mesh">
                {/* Abstract 3D Element (CSS + SVG) */}
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-gradient-to-br from-fuchsia-200/20 to-violet-300/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-200/20 to-blue-300/20 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-20">
                    <motion.div
                        initial={mounted ? "hidden" : { opacity: 1, y: 0 }}
                        animate={mounted ? "visible" : { opacity: 1, y: 0 }}
                        variants={containerVariants}
                        className="space-y-10"
                    >
                        <motion.div variants={itemVariants}>
                            <span className="inline-block px-5 py-2 rounded-2xl glass-effect border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/5">
                                La Ingeniería del Tiempo
                            </span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-7xl md:text-9xl font-black text-foreground leading-[0.8] tracking-tighter"
                        >
                            ECOSISTEMA <br />
                            <span className="text-primary italic">AUTÓNOMO.</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-xl sm:text-2xl text-muted-foreground max-w-lg leading-relaxed italic font-medium">
                            Consultoría Estratégica de <span className="text-foreground font-bold underline decoration-primary/30">IA Generativa</span> para líderes que exigen la excelencia absoluta.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="lg" className="h-16 px-10 text-lg bg-primary text-white hover:bg-primary/90 shadow-2xl shadow-primary/20 rounded-[2rem] font-black transition-all hover:scale-105 active:scale-95">
                                        Solicitar Auditoría
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800 glass-effect">
                                        <LeadForm />
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Link href="/marketplace">
                                <Button variant="outline" size="lg" className="h-16 px-10 text-lg rounded-[2rem] border-primary/20 glass-effect hover:bg-primary/5 text-foreground font-black transition-all hover:scale-105 active:scale-95">
                                    Marketplace
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div variants={itemVariants} className="pt-10 flex items-center gap-6 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-primary/20 border-4 border-background shadow-lg" />
                                ))}
                            </div>
                            <span className="max-w-[200px] leading-tight flex flex-col">
                                <span className="text-primary">+50 marcas</span>
                                confían en nuestra visión
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Visual Element */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative hidden lg:flex items-center justify-center z-20"
                    >
                        <div className="relative w-full aspect-square max-w-[550px]">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-10 blur-[120px] animate-pulse" />
                            <div className="relative w-full h-full glass-effect rounded-[4rem] p-8 border-white/20 shadow-2xl overflow-hidden group">
                                <div className="absolute inset-0 bg-grid-mesh opacity-20 group-hover:opacity-40 transition-opacity" />
                                <Image
                                    src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80"
                                    alt="Abstract AI Mesh"
                                    fill
                                    priority
                                    className="object-cover rounded-[3rem] grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
                                />
                                <div className="absolute bottom-12 left-12 right-12 glass-effect p-6 rounded-3xl border-white/10 translate-y-20 group-hover:translate-y-0 transition-transform duration-500 z-10">
                                    <p className="text-sm font-black text-white uppercase tracking-widest italic">Core Engine Alpha-01</p>
                                    <div className="h-1 w-full bg-white/10 mt-3 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-2/3 animate-shimmer" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
