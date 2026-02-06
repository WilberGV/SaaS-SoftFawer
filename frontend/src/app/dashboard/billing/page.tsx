'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { CreditCard, History, Package, ShieldCheck, Mail, ArrowLeft, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Order {
    id: string;
    amount: number;
    status: string;
    timestamp: Timestamp | Date;
    currency: string;
}

export default function BillingPage() {
    const { user, appUser } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [managingSub, setManagingSub] = useState(false);

    const handleManageSubscription = async () => {
        if (!user?.email) return;
        setManagingSub(true);
        try {
            const response = await fetch('/api/create-portal-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, returnUrl: window.location.href }),
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('No se pudo acceder al portal de facturación.');
                console.error(data);
            }
        } catch (error) {
            console.error(error);
            alert('Error al conectar con Stripe.');
        } finally {
            setManagingSub(false);
        }
    };

    useEffect(() => {
        const fetchUserOrders = async () => {
            if (!user?.email || !db) return;
            try {
                const q = query(
                    collection(db, 'orders'),
                    where('email', '==', user.email),
                    orderBy('timestamp', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const fetchedOrders = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Order));
                setOrders(fetchedOrders);
            } catch (e) {
                console.error("Error fetching user orders:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchUserOrders();
    }, [user?.email]);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-background bg-grid-mesh">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 glass-effect rounded-lg hover:text-primary transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                    <CreditCard size={24} />
                                </div>
                                <h1 className="text-3xl font-black uppercase tracking-tighter">Facturación</h1>
                            </div>
                            <p className="text-muted-foreground text-sm italic">Gestiona tus planes y revisa tu historial de pagos.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-2 glass-effect p-8 rounded-[2.5rem] border-primary/10 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="text-primary" size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Plan Actual</span>
                            </div>
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
                                {appUser?.role === 'superadmin' ? 'Acceso Vitalicio' : 'SoftFawer Pro'}
                            </h2>
                            <p className="text-muted-foreground text-sm italic mb-8">
                                Disfrutas de todas las funciones premium y soporte prioritario.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleManageSubscription}
                                disabled={managingSub}
                                className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {managingSub ? 'Redirigiendo...' : 'Cambiar Plan'}
                            </button>
                            <span className="text-[10px] font-mono opacity-50">Próximo cobro: N/A</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-effect p-8 rounded-[2.5rem] border-secondary/10 flex flex-col items-center text-center group"
                    >
                        <div className="w-16 h-16 bg-secondary/10 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                            <ShieldCheck size={32} className="text-secondary" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 italic uppercase">Soporte Directo</h3>
                        <p className="text-xs text-muted-foreground italic mb-6">
                            ¿Necesitas ayuda con un pago o factura?
                        </p>
                        <a
                            href="mailto:soporte@softfawer.com"
                            className="w-full flex items-center justify-center gap-2 py-4 border border-white/10 rounded-2xl hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest"
                        >
                            <Mail size={14} />
                            Contactar
                        </a>
                    </motion.div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2 px-4">
                        <History size={18} className="text-primary opacity-50" />
                        <h3 className="text-sm font-black uppercase tracking-widest italic">Historial de Transacciones</h3>
                    </div>

                    <div className="glass-effect rounded-[2.5rem] overflow-hidden border-primary/5">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-primary/5 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">
                                        <th className="px-8 py-6">Fecha</th>
                                        <th className="px-8 py-6">ID Pedido</th>
                                        <th className="px-8 py-6">Monto</th>
                                        <th className="px-8 py-6">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-primary/5">
                                    <AnimatePresence mode="popLayout">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Consultando archivos...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : orders.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-16 text-center text-muted-foreground italic text-xs uppercase tracking-widest opacity-30">
                                                    No se han registrado transacciones aún.
                                                </td>
                                            </tr>
                                        ) : (
                                            orders.map((order, idx) => {
                                                const date = order.timestamp instanceof Timestamp ? order.timestamp.toDate() : new Date(order.timestamp || Date.now());
                                                return (
                                                    <motion.tr
                                                        key={order.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        className="group hover:bg-white/[0.02] transition-colors"
                                                    >
                                                        <td className="px-8 py-6">
                                                            <div className="text-xs font-bold text-foreground">
                                                                {date.toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-2 group/id">
                                                                <span className="font-mono text-[10px] opacity-40 group-hover/id:opacity-100 transition-opacity">
                                                                    #{order.id.slice(0, 10)}
                                                                </span>
                                                                <ExternalLink size={10} className="opacity-0 group-hover/id:opacity-30" />
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="font-black italic tracking-tighter text-sm">
                                                                ${(order.amount || 0).toLocaleString()} <span className="text-[9px] not-italic opacity-40">{order.currency || 'USD'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest italic border ${order.status === 'succeeded' || order.status === 'completed' || order.status === 'paid'
                                                                ? 'bg-green-500/10 text-green-500 border-green-500/10'
                                                                : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/10'
                                                                }`}>
                                                                {order.status || 'pending'}
                                                            </span>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
