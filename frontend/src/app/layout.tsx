import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { PlatformProvider } from '@/context/PlatformContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import Script from 'next/script';
/**
 * @fileoverview Root layout for the application.
 */

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'SoftFawer',
    'url': 'https://softfawer.com',
    'logo': 'https://softfawer.com/logo.png',
    'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+34-600-000-000',
        'contactType': 'customer service',
        'areaServed': 'ES',
        'availableLanguage': ['Spanish', 'English']
    },
    'sameAs': [
        'https://twitter.com/softfawer',
        'https://linkedin.com/company/softfawer'
    ]
};

export const metadata: Metadata = {
    title: {
        default: 'SoftFawer - Ingeniería de IA y Automatización Estratégica',
        template: '%s | SoftFawer'
    },
    description: 'Transforma tu negocio en un ecosistema autónomo con consultoría estratégica de IA y software SaaS propietario de SoftFawer.',
    keywords: ['IA estratégica', 'automatización de negocios', 'SaaS corporativo', 'ingeniería de IA', 'SoftFawer', 'consultoría tecnológica', 'bots WhatsApp'],
    authors: [{ name: 'SoftFawer Engineering Team' }],
    creator: 'SoftFawer',
    publisher: 'SoftFawer',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: 'https://softfawer.com/',
    },
    openGraph: {
        title: 'SoftFawer - Ingeniería de IA y Automatización Estratégica',
        description: 'Transforma tu negocio en un ecosistema autónomo con IA estratégica personalizada.',
        url: 'https://softfawer.com',
        siteName: 'SoftFawer',
        images: [
            {
                url: 'https://softfawer.com/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'SoftFawer - IA Estratégica',
            },
        ],
        locale: 'es_ES',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SoftFawer - Ingeniería de IA y Automatización Estratégica',
        description: 'Automatiza citas, pedidos y soporte con IA avanzada. Sin complicaciones.',
        images: ['https://softfawer.com/twitter-card.jpg'],
        creator: '@softfawer',
    },
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" suppressHydrationWarning>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className={`${inter.className} antialiased`}>
                <AuthProvider>
                    <CartProvider>
                        <PlatformProvider>
                            <Navbar />
                            <main className="min-h-screen">
                                {children}
                            </main>
                            <Footer />
                            <CookieConsent />
                        </PlatformProvider>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

