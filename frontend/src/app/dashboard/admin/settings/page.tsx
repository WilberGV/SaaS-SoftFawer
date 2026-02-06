'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Settings, ShieldAlert, Globe, Bell, Save, RefreshCw } from 'lucide-react';
import { logActivity } from '@/lib/logger';
import { motion } from 'framer-motion';

export default function PlatformSettingsPage() {
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        alertBanner: '',
        supportEmail: 'support@softfawer.com',
        allowNewRegistrations: true,
        globalDiscount: 0
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchSettings = async () => {
        if (!db) return;
        try {
            setLoading(true);
            const docRef = doc(db, 'platform', 'settings');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSettings(docSnap.data() as any);
            } else {
                // Initialize settings if not exists
                await setDoc(docRef, settings);
            }
        } catch (e) {
            console.error("Error fetching platform settings:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async () => {
        if (!db) return;
        try {
            setSaving(true);
            const docRef = doc(db, 'platform', 'settings');
            await updateDoc(docRef, settings);
            await logActivity({ level: 'success', service: 'ADMIN', message: 'Configuración global de la plataforma actualizada' });
            alert('Configuración guardada correctamente.');
        } catch (e) {
            console.error("Error saving platform settings:", e);
            alert('Error al guardar la configuración.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <RefreshCw className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                <Settings size={24} />
                            </div>
                            <h1 className="text-3xl font-black uppercase tracking-tighter">Configuración Global</h1>
                        </div>
                        <p className="text-muted-foreground text-sm italic">Controla parámetros generales de la plataforma SoftFawer.</p>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                        Guardar Cambios
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* General Settings */}
                    <section className="glass-effect p-8 rounded-[2rem] border-primary/5">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <Globe size={20} className="text-primary" />
                            Estado de la Plataforma
                        </h2>

                        <div className="space-y-6">
                            <ToggleSetting
                                title="Modo Mantenimiento"
                                description="Activa una página de espera global y bloquea el acceso a todas las rutas públicas."
                                checked={settings.maintenanceMode}
                                onChange={(val) => setSettings({ ...settings, maintenanceMode: val })}
                            />

                            <ToggleSetting
                                title="Nuevos Registros"
                                description="Permite o bloquea la creación de nuevas cuentas de usuario."
                                checked={settings.allowNewRegistrations}
                                onChange={(val) => setSettings({ ...settings, allowNewRegistrations: val })}
                            />
                        </div>
                    </section>

                    {/* Notification Banner */}
                    <section className="glass-effect p-8 rounded-[2rem] border-secondary/10">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <Bell size={20} className="text-secondary" />
                            Alertas y Avisos
                        </h2>

                        <div className="space-y-4">
                            <label className="block">
                                <span className="text-xs font-black uppercase tracking-widest opacity-50 mb-2 block">Texto del Banner Global</span>
                                <textarea
                                    className="w-full p-4 bg-primary/5 border border-primary/10 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all italic text-sm min-h-[100px]"
                                    placeholder="Ej: ¡Oferta relámpago! 20% de descuento en todos nuestros bots..."
                                    value={settings.alertBanner}
                                    onChange={(e) => setSettings({ ...settings, alertBanner: e.target.value })}
                                />
                            </label>
                        </div>
                    </section>

                    {/* Advanced parameters */}
                    <section className="glass-effect p-8 rounded-[2rem] border-red-500/10">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <ShieldAlert size={20} className="text-red-500" />
                            Parámetros Críticos
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="block">
                                <span className="text-xs font-black uppercase tracking-widest opacity-50 mb-2 block">Email de Soporte</span>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 bg-primary/5 border border-primary/10 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={settings.supportEmail}
                                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                />
                            </label>

                            <label className="block">
                                <span className="text-xs font-black uppercase tracking-widest opacity-50 mb-2 block">Descuento Global (%)</span>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 bg-primary/5 border border-primary/10 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={settings.globalDiscount}
                                    onChange={(e) => setSettings({ ...settings, globalDiscount: parseInt(e.target.value) || 0 })}
                                />
                            </label>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function ToggleSetting({ title, description, checked, onChange }: { title: string, description: string, checked: boolean, onChange: (val: boolean) => void }) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="max-w-[70%]">
                <div className="text-sm font-bold uppercase tracking-tight">{title}</div>
                <div className="text-[10px] text-muted-foreground italic mt-1 leading-relaxed">{description}</div>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`w-14 h-8 rounded-full relative transition-all shadow-inner ${checked ? 'bg-primary' : 'bg-muted'}`}
            >
                <motion.div
                    animate={{ x: checked ? 26 : 4 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                />
            </button>
        </div>
    );
}
