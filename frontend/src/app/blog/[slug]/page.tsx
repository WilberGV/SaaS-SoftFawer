import { getCachedBlogPostBySlug, getCachedBlogPosts, getCachedProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import BlogSidebar from '@/components/BlogSidebar';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import ReadingProgressBar from '@/components/ReadingProgressBar';

export async function generateStaticParams() {
    const posts = await getCachedBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const [post, allPosts, allProducts] = await Promise.all([
        getCachedBlogPostBySlug(slug),
        getCachedBlogPosts(),
        getCachedProducts()
    ]);

    if (!post) {
        notFound();
    }

    const relatedPosts = allPosts
        .filter(p => p.id !== post.id && p.category === post.category)
        .slice(0, 2);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "articleBody": post.content,
        "author": {
            "@type": "Person",
            "name": post.author
        },
        "datePublished": post.date,
        "image": post.image,
        "keywords": post.tags.join(", ")
    };

    return (
        <>
            <ReadingProgressBar />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />
            <main className="bg-background bg-grid-mesh min-h-screen pt-24 pb-12">
                <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all mb-12 group"
                    >
                        <ArrowLeft size={20} className="group-hover:rotate-[-12deg] transition-transform" />
                        <span className="underline decoration-primary/30 decoration-2">Volver a la biblioteca</span>
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-12">
                            <div className="glass-effect rounded-[3rem] p-8 md:p-12 border-primary/10 overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                    <span className="text-[12rem] font-black italic">FAWER</span>
                                </div>

                                <div className="relative z-10">
                                    <div className="flex flex-wrap items-center gap-6 text-[10px] md:text-xs text-muted-foreground mb-8 uppercase tracking-[0.2em] font-black">
                                        <span className="bg-primary text-white px-4 py-1.5 rounded-full">
                                            {post.category}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Calendar size={14} className="text-primary" />
                                            {new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Clock size={14} className="text-primary" />
                                            {post.readTime}
                                        </span>
                                    </div>

                                    <h1 className="text-4xl md:text-6xl font-black mb-8 text-foreground leading-[1.1] tracking-tight">
                                        {post.title}
                                    </h1>

                                    <div className="flex items-center gap-4 mb-10 pb-10 border-b border-primary/10">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary text-xl">
                                            {post.author[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-foreground">{post.author}</p>
                                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-0.5">Autor Expert</p>
                                        </div>
                                    </div>

                                    {post.tldr && (
                                        <div className="mb-12 p-8 bg-primary/5 border-l-8 border-primary rounded-r-3xl glass-effect border-y-0 border-r-0">
                                            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-4 flex items-center gap-3">
                                                <span className="text-2xl">⚡</span> IA INSIGHT (TL;DR)
                                            </h3>
                                            <p className="text-lg text-foreground font-medium italic leading-relaxed">
                                                "{post.tldr}"
                                            </p>
                                        </div>
                                    )}

                                    <div className="h-96 md:h-[450px] bg-black/60 rounded-[2.5rem] mb-12 flex items-center justify-center relative overflow-hidden group/img shadow-2xl">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-600/30 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" />
                                        <span className="text-[10rem] drop-shadow-2xl animate-pulse">📱</span>
                                    </div>

                                    <div className="prose prose-lg md:prose-xl max-w-none dark:prose-invert">
                                        <div className="text-muted-foreground/90 whitespace-pre-line leading-loose font-medium selection:bg-primary/30">
                                            {post.content}
                                        </div>
                                    </div>

                                    <div className="mt-16 pt-12 border-t border-primary/10">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Expertise Taxonomy</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {post.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="bg-primary/5 hover:bg-primary/10 transition-colors text-primary text-[10px] font-black uppercase px-5 py-2 rounded-full border border-primary/10 cursor-alias"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Related Posts */}
                            {relatedPosts.length > 0 && (
                                <section className="mt-20">
                                    <h3 className="text-3xl font-black mb-8 text-foreground tracking-tight underline decoration-primary decoration-4 underline-offset-8">
                                        Continúa Explorando
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {relatedPosts.map(p => (
                                            <BlogCard key={p.id} post={p} />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        <div className="lg:col-span-1">
                            <BlogSidebar
                                recentPosts={allPosts.filter(p => p.id !== post.id)}
                                products={allProducts}
                                onSearch={() => { }}
                            />
                        </div>
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
}
