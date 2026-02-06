'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Menu, X, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { usePlatform } from '@/context/PlatformContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { user, isSuperAdmin } = useAuth();
    const { cartTotal, items } = useCart();
    const { settings } = usePlatform();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 glass-effect border-b border-border/50">
            <AnimatePresence>
                {settings.alertBanner && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-primary text-primary-foreground overflow-hidden"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-center flex items-center justify-center gap-4 italic">
                            <span>{settings.alertBanner}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-accent">
                            SoftFawer
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link href="/" className="text-foreground hover:text-accent px-3 py-2 rounded-md transition-all duration-300">
                                Inicio
                            </Link>
                            <Link href="/nosotros" className="text-foreground hover:text-accent px-3 py-2 rounded-md transition-all duration-300">
                                Nosotros
                            </Link>
                            <Link href="/marketplace" className="text-foreground hover:text-accent px-3 py-2 rounded-md transition-all duration-300">
                                Marketplace
                            </Link>
                            <Link href="/blog" className="text-foreground hover:text-accent px-3 py-2 rounded-md transition-all duration-300">
                                Blog
                            </Link>
                            <Link href="/contacto" className="text-foreground hover:text-accent px-3 py-2 rounded-md transition-all duration-300">
                                Contacto
                            </Link>
                            {user ? (
                                <div className="flex items-center gap-4">
                                    {isSuperAdmin && (
                                        <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest italic animate-pulse">
                                            SuperAdmin
                                        </span>
                                    )}
                                    <Link href="/dashboard" className="text-foreground hover:text-accent px-3 py-2 rounded-md transition-all duration-300 flex items-center gap-2">
                                        <UserIcon size={18} />
                                        Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <Link href="/login" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-full transition-all duration-300 shadow-lg shadow-primary/20">
                                    Acceder
                                </Link>
                            )}
                            <Link href="/carrito" className="relative p-2 text-foreground hover:text-accent rounded-full transition-all duration-300">
                                <ShoppingCart size={24} />
                                {items.length > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {items.length}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-accent focus:outline-none"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-background border-b border-border">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" className="text-foreground hover:text-accent block px-3 py-2 rounded-md text-base font-medium">Inicio</Link>
                        <Link href="/nosotros" className="text-foreground hover:text-accent block px-3 py-2 rounded-md text-base font-medium">Nosotros</Link>
                        <Link href="/marketplace" className="text-foreground hover:text-accent block px-3 py-2 rounded-md text-base font-medium">Marketplace</Link>
                        <Link href="/blog" className="text-foreground hover:text-accent block px-3 py-2 rounded-md text-base font-medium">Blog</Link>
                        <Link href="/contacto" className="text-foreground hover:text-accent block px-3 py-2 rounded-md text-base font-medium">Contacto</Link>
                        <Link href="/dashboard" className="text-foreground hover:text-accent block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
