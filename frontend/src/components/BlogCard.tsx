'use client';

import Link from 'next/link';
import { BlogPost } from '@/types';
import { Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface BlogCardProps {
    post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <motion.article
            whileHover={{ y: -10, rotateZ: 0.5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="glass-effect rounded-3xl overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all"
        >
            <div className="h-52 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <span className="text-5xl drop-shadow-lg group-hover:rotate-12 transition-transform">📱</span>
            </div>

            <div className="p-8">
                <div className="flex items-center gap-4 text-[10px] sm:text-xs text-muted-foreground mb-4 uppercase tracking-widest font-bold">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg">
                        {post.category}
                    </span>
                    <span className="flex items-center gap-1.5 underline decoration-primary/20">
                        <Calendar size={12} className="text-primary" />
                        {new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="flex items-center gap-1.5 underline decoration-primary/20">
                        <Clock size={12} className="text-primary" />
                        {post.readTime}
                    </span>
                </div>

                <h3 className="text-2xl font-black mb-3 text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed italic">
                    {post.excerpt}
                </p>

                <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 hover:bg-primary hover:text-white transition-all group/btn"
                >
                    Explorar artículo
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </Link>
            </div>
        </motion.article>
    );
}
