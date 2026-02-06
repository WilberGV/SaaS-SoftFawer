'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

interface PlatformSettings {
    maintenanceMode: boolean;
    alertBanner: string;
    supportEmail: string;
    allowNewRegistrations: boolean;
    globalDiscount: number;
}

interface PlatformContextType {
    settings: PlatformSettings;
    loading: boolean;
}

const defaultSettings: PlatformSettings = {
    maintenanceMode: false,
    alertBanner: '',
    supportEmail: 'support@softfawer.com',
    allowNewRegistrations: true,
    globalDiscount: 0
};

const PlatformContext = createContext<PlatformContextType>({
    settings: defaultSettings,
    loading: true
});

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const { isSuperAdmin } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!db) return;

        const unsubscribe = onSnapshot(doc(db, 'platform', 'settings'), (doc) => {
            if (doc.exists()) {
                const data = doc.data() as PlatformSettings;
                setSettings(data);

                // Maintenance Mode Redirect Logic
                if (data.maintenanceMode && !isSuperAdmin && pathname !== '/mantenimiento' && !pathname.startsWith('/login')) {
                    router.replace('/mantenimiento');
                } else if (!data.maintenanceMode && pathname === '/mantenimiento') {
                    router.replace('/');
                }
            }
            setLoading(false);
        }, (error) => {
            console.error("Error listening to platform settings:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isSuperAdmin, pathname, router]);

    return (
        <PlatformContext.Provider value={{ settings, loading }}>
            {children}
        </PlatformContext.Provider>
    );
};

export const usePlatform = () => useContext(PlatformContext);
