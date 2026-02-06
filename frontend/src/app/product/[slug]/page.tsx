import * as React from 'react';
import { products } from '@/data/products';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductClient from './ProductClient';
import { Metadata } from 'next';

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const product = products.find(p => p.slug === params.slug);
    return {
        title: product ? `${product.name} | SoftFawer` : 'Producto | SoftFawer',
        description: product?.description || 'Detalles del producto autónomo.',
    };
}

export default function ProductPage({ params }: Props) {
    const { slug } = params;
    const product = products.find(p => p.slug === slug);

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
                <Link href="/marketplace">
                    <Button>Volver al Marketplace</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Premium Background Architecture */}
            <div className="absolute inset-0 bg-grid-mesh opacity-20 pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-16">
                    <Link href="/marketplace" className="inline-flex items-center gap-3 text-muted-foreground hover:text-primary transition-all font-black uppercase tracking-widest text-xs group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Retorno al Marketplace
                    </Link>
                </div>

                <ProductClient product={product} />
            </div>
        </div>
    );
}
