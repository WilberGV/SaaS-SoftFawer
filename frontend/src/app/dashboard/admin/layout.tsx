'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isSuperAdmin, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isSuperAdmin) {
            router.push('/dashboard');
        }
    }, [isSuperAdmin, loading, router]);

    if (loading) return null; // AuthProvider handles main loading

    if (!isSuperAdmin) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <ShieldCheck size={64} className="text-destructive mb-6 animate-bounce" />
                <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">Acceso Denegado</h1>
                <p className="text-muted-foreground text-sm italic">No tienes permisos para acceder a esta sección.</p>
            </div>
        );
    }

    return <>{children}</>;
}
