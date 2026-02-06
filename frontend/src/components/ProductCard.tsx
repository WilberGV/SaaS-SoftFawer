'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Product } from '@/types';
import { Check, ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProductCardProps {
    product: Product;
    isFeatured?: boolean;
}

export default function ProductCard({ product, isFeatured }: ProductCardProps) {
    const { addToCart } = useCart();
    const isOutOfStock = product.stock !== undefined && product.stock <= 0;

    return (
        <motion.div
            whileHover={{ y: -12, rotateZ: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`group glass-effect rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all flex flex-col h-full border-primary/10 ${isFeatured ? 'md:flex-row min-h-[400px]' : ''}`}
        >
            <div className={`relative overflow-hidden bg-black/20 ${isFeatured ? 'md:w-2/5 h-full min-h-[300px]' : 'h-64 w-full'}`}>
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out grayscale-[0.2] group-hover:grayscale-0"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl opacity-30 drop-shadow-2xl group-hover:scale-125 transition-transform duration-500">
                        {product.icon}
                    </div>
                )}

                {/* Overlay Detail */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />

                {/* Category Badge */}
                <div className="absolute top-6 left-6 glass-effect px-4 py-2 rounded-2xl border-white/20 flex items-center gap-2 shadow-xl">
                    <span className="text-sm">{product.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{product.category}</span>
                </div>

                {/* Action Badges */}
                {product.badge && (
                    <div className="absolute top-6 right-6 bg-primary text-white text-[10px] font-black px-4 py-2 rounded-2xl shadow-xl shadow-primary/30 animate-pulse">
                        {product.badge}
                    </div>
                )}

                {isOutOfStock && (
                    <div className="absolute top-6 right-6 bg-destructive text-destructive-foreground text-[10px] font-black px-4 py-2 rounded-2xl shadow-xl shadow-destructive/30">
                        AGOTADO
                    </div>
                )}
            </div>

            <div className={`p-8 md:p-10 flex flex-col flex-grow ${isFeatured ? 'md:w-3/5' : ''}`}>
                <div className="flex justify-between items-start mb-6">
                    <h3 className={`font-black tracking-tight text-foreground group-hover:text-primary transition-colors leading-[1.1] ${isFeatured ? 'text-3xl md:text-5xl' : 'text-2xl'}`}>
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-1.5 glass-effect bg-yellow-400/10 px-3 py-1.5 rounded-xl border-yellow-400/20">
                        <Star size={14} className="fill-yellow-400 text-yellow-500" />
                        <span className="text-[11px] font-black text-yellow-700">4.9</span>
                    </div>
                </div>

                <p className={`text-muted-foreground mb-8 leading-relaxed italic font-medium ${isFeatured ? 'text-lg md:text-xl line-clamp-3' : 'text-sm line-clamp-2'}`}>
                    {product.description}
                </p>

                <div className={`grid gap-4 mb-10 flex-grow ${isFeatured ? 'grid-cols-1 md:grid-cols-2' : ''}`}>
                    {product.features.slice(0, isFeatured ? 6 : 3).map((feature, index) => (
                        <div key={index} className="flex items-start gap-4 group/feat">
                            <div className="w-6 h-6 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary/20 group-hover/feat:bg-primary group-hover/feat:text-white transition-colors">
                                <Check size={14} className="font-bold" />
                            </div>
                            <span className="text-xs md:text-sm text-foreground/80 font-bold tracking-tight">{feature}</span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-auto pt-8 border-t border-primary/10">
                    <div className="flex flex-col">
                        <span className={`font-black text-foreground leading-none ${isFeatured ? 'text-4xl' : 'text-3xl'}`}>{product.price}€</span>
                        <span className="text-muted-foreground text-[10px] font-black mt-1 uppercase tracking-widest">Suscripción Mensual</span>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={`/product/${product.slug}`}
                            className="glass-effect p-4 rounded-2xl border-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95"
                        >
                            <ArrowRight size={22} />
                        </Link>
                        <button
                            onClick={() => addToCart(product as any)}
                            disabled={isOutOfStock}
                            className={`bg-primary text-white p-4 rounded-2xl transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 ${isOutOfStock ? 'opacity-50 cursor-not-allowed hover:scale-100 bg-muted' : ''}`}
                        >
                            <ShoppingCart size={22} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
