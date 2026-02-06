import BlogContent from './BlogContent';
import { getCachedBlogPosts, getCachedProducts } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog de Automatización e IA',
    description: 'Artículos, guías y novedades sobre automatización de negocios, inteligencia artificial y bots de WhatsApp.',
};

export default async function BlogPage() {
    const [posts, products] = await Promise.all([
        getCachedBlogPosts(),
        getCachedProducts()
    ]);

    return <BlogContent posts={posts} products={products} />;
}
