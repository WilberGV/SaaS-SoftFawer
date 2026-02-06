'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ArrowRight, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CartPage() {
    const { items, removeFromCart, cartTotal } = useCart();

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-4">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[0%] right-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="bg-card w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-border shadow-xl">
                        <ShoppingCart className="text-muted-foreground" size={32} />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-4">Tu carrito está vacío</h1>
                    <p className="text-muted-foreground mb-8 text-lg">Parece que aún no has añadido ningún bot a tu selección.</p>
                    <Link
                        href="/marketplace"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:shadow-[0_0_20px_-5px_rgba(var(--primary),0.5)] transition-all hover:scale-105"
                    >
                        Explorar Marketplace <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 mb-8"
                >
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Tu Carrito</h1>
                    <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-bold border border-accent/20">
                        {items.length} {items.length === 1 ? 'Bot' : 'Bots'}
                    </span>
                </motion.div>

                <div className="grid grid-cols-1 gap-8">
                    <div className="bg-card/50 backdrop-blur-xl rounded-3xl border border-border overflow-hidden shadow-2xl">
                        <ul className="divide-y divide-border/50">
                            {items.map((item, index) => (
                                <motion.li
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors group"
                                >
                                    <div className="flex items-center gap-6 w-full sm:w-auto">
                                        <div className="relative w-20 h-20 bg-muted rounded-2xl overflow-hidden border border-border/50 group-hover:border-accent/30 transition-colors">
                                            <Image
                                                src={item.image || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60'}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">{item.name}</h3>
                                            <p className="text-muted-foreground font-medium">{item.quantity} x {item.price}€</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8">
                                        <span className="text-2xl font-black text-foreground">{item.price * item.quantity}€</span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-3 text-destructive border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground rounded-xl transition-all shadow-lg hover:shadow-destructive/20"
                                            aria-label="Eliminar producto"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>

                        <div className="p-8 bg-muted/30 border-t border-border/50">
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-muted-foreground text-lg font-medium">Total de la orden</span>
                                <span className="text-4xl font-black text-foreground">{cartTotal}€</span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/marketplace"
                                    className="flex-1 py-4 text-center text-foreground font-bold hover:bg-white/5 rounded-2xl border border-border transition-all"
                                >
                                    Seguir Comprando
                                </Link>
                                <Link
                                    href="/checkout"
                                    className="flex-[2] py-4 bg-primary text-primary-foreground rounded-2xl font-black text-lg hover:shadow-[0_0_30px_-5px_rgba(var(--primary),0.6)] transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Finalizar Compra <ArrowRight size={22} />
                                </Link>
                            </div>
                            <p className="text-center mt-6 text-xs text-muted-foreground uppercase tracking-widest font-bold opacity-60">
                                Pago seguro procesado por Stripe
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
