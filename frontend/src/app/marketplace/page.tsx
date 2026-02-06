import MarketplaceContent from './MarketplaceContent';
import { getCachedProducts } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Marketplace de Bots IA',
    description: 'Explora nuestra selección de soluciones SaaS y bots de WhatsApp impulsados por IA para automatizar tu negocio.',
};

export default async function MarketplacePage() {
    const products = await getCachedProducts();

    return <MarketplaceContent products={products} />;
}
