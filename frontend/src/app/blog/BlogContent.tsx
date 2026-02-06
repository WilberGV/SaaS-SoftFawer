'use client';

import { useState, useMemo } from 'react';
import BlogCard from '@/components/BlogCard';
import BlogSidebar from '@/components/BlogSidebar';
import { BlogPost, Product } from '@/types';

interface BlogContentProps {
    posts: BlogPost[];
    products: Product[];
}

export default function BlogContent({ posts, products }: BlogContentProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = useMemo(() => {
        if (!searchQuery) return posts;

        const query = searchQuery.toLowerCase();
        return posts.filter(post =>
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.category.toLowerCase().includes(query) ||
            post.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }, [posts, searchQuery]);

    return (
        <main className="bg-background bg-grid-mesh min-h-screen pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-black mb-6 text-foreground tracking-tight">
                        SoftFawer <span className="text-primary italic">Blog</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Insights, guías y casos de éxito sobre la revolución de la <span className="text-foreground font-bold underline decoration-primary/30">automatización inteligente</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        {filteredPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {filteredPosts.map((post) => (
                                    <BlogCard key={post.id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 glass-effect rounded-3xl border-dashed">
                                <p className="text-muted-foreground text-lg">No se encontraron artículos que coincidan con tu búsqueda.</p>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <BlogSidebar
                            recentPosts={posts}
                            products={products}
                            onSearch={setSearchQuery}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
