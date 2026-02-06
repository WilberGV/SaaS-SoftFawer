
import dynamic from 'next/dynamic';
import Hero from '@/components/landing/Hero';

const Features = dynamic(() => import('@/components/landing/Features'), { ssr: true });
const HowItWorks = dynamic(() => import('@/components/landing/HowItWorks'), { ssr: true });
const Marketplace = dynamic(() => import('@/components/landing/Marketplace'), { ssr: true });
const UseCases = dynamic(() => import('@/components/landing/UseCases'), { ssr: true });
const Guarantee = dynamic(() => import('@/components/landing/Guarantee'), { ssr: true });
const CTA = dynamic(() => import('@/components/landing/CTA'), { ssr: true });

export default function Home() {
    return (
        <main className="flex flex-col min-h-screen">

            <Hero />
            <Features />
            <HowItWorks />
            <Marketplace />
            <UseCases />
            <Guarantee />
            <CTA />
        </main>
    );
}
