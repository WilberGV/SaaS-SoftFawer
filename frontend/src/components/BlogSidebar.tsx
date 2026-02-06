'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { BlogPost, Product } from '@/types';

interface BlogSidebarProps {
    recentPosts: BlogPost[];
    products: Product[];
    onSearch: (query: string) => void;
}

export default function BlogSidebar({ recentPosts, products, onSearch }: BlogSidebarProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    return (
        <aside className="space-y-10 group/sidebar">
            <div className="glass-effect rounded-3xl p-8 border-primary/10">
                <h3 className="font-black text-xl mb-6 text-foreground tracking-tight flex items-center gap-2">
                    <span className="text-primary text-2xl">🔍</span> Buscar
                </h3>
                <form onSubmit={handleSearch} className="relative group">
                    <input
                        type="text"
                        placeholder="Inicia tu búsqueda..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/10 border border-primary/20 rounded-2xl py-3 pl-5 pr-12 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground/50"
                    />
                    <button
                        type="submit"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform active:scale-95"
                    >
                        <Search size={22} />
                    </button>
                </form>
            </div>

            <div className="glass-effect rounded-3xl p-8 border-primary/10">
                <h3 className="font-black text-xl mb-6 text-foreground tracking-tight flex items-center gap-2">
                    <span className="text-primary text-2xl">🔥</span> Recientes
                </h3>
                <div className="space-y-6">
                    {recentPosts.slice(0, 3).map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="block group/item"
                        >
                            <h4 className="text-sm font-bold text-foreground leading-tight group-hover/item:text-primary transition-colors line-clamp-2 mb-2">
                                {post.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                                <span className="w-4 h-[2px] bg-primary/30"></span>
                                {new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="relative glass-effect rounded-3xl p-8 overflow-hidden group/ad">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/ad:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-primary rounded-full blur-3xl" />
                </div>

                <h3 className="font-black text-xl mb-3 text-foreground tracking-tight underline decoration-primary/30 decoration-4">
                    ¿Automatizamos?
                </h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed italic">
                    Libera el potencial de tu marca con nuestros bots especializados.
                </p>
                <div className="space-y-3">
                    {products.slice(0, 3).map((product) => (
                        <Link
                            key={product.id}
                            href="/#productos"
                            className="flex items-center justify-between p-3 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-xl text-xs font-bold text-primary group/link transition-all"
                        >
                            {product.name}
                            <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}
