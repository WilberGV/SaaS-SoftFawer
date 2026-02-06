'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, Timestamp, onSnapshot } from 'firebase/firestore';
import { ShoppingCart, Search, Filter, ArrowLeft, CreditCard, Calendar, User, DollarSign, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Order {
    id: string;
    email: string;
    amount: number;
    status: string;
    timestamp: Timestamp | Date;
    items?: any[];
    currency?: string;
    customerName?: string;
}

export default function OrderManagementPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!db) return;
        setLoading(true);
        const q = query(
            collection(db, 'orders'),
            orderBy('timestamp', 'desc'),
            limit(100)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedOrders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Order));
            setOrders(fetchedOrders);
            setLoading(false);
        }, (error) => {
            console.error("Error listening to orders:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredOrders = orders.filter(order =>
        order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const downloadCSV = () => {
        const headers = ["ID", "Email", "Amount", "Currency", "Status", "Date"];
        const rows = filteredOrders.map(order => [
            order.id,
            order.email,
            order.amount,
            order.currency,
            order.status,
            order.timestamp instanceof Timestamp ? order.timestamp.toDate().toISOString() : new Date(order.timestamp || Date.now()).toISOString()
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "orders_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-background bg-grid-mesh">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 glass-effect rounded-lg hover:text-primary transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                    <ShoppingCart size={24} />
                                </div>
                                <h1 className="text-3xl font-black uppercase tracking-tighter">Gestión de Pedidos</h1>
                            </div>
                            <p className="text-muted-foreground text-sm italic inline-flex items-center gap-2">
                                <DollarSign size={14} className="text-primary" />
                                Ingresos Totales (Muestra): <span className="text-foreground font-bold font-mono">${totalRevenue.toLocaleString()}</span>
                            </p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-96 group flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar por email o ID..."
                                className="w-full pl-12 pr-4 py-3 bg-primary/5 border border-primary/10 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all italic text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={downloadCSV}
                            className="p-3 bg-secondary/10 text-secondary rounded-2xl hover:bg-secondary/20 transition-all"
                            title="Exportar a CSV"
                        >
                            <Download size={20} />
                        </button>
                    </div>
                </div>

                <div className="glass-effect rounded-3xl overflow-hidden shadow-2xl border-primary/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-primary/5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">
                                    <th className="px-8 py-6">ID Pedido / Fecha</th>
                                    <th className="px-8 py-6">Cliente</th>
                                    <th className="px-8 py-6">Monto</th>
                                    <th className="px-8 py-6">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                <AnimatePresence mode="popLayout">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Sincronizando transacciones...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center text-muted-foreground italic">
                                                No se encontraron pedidos recientes.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map((order, idx) => {
                                            const date = order.timestamp instanceof Timestamp ? order.timestamp.toDate() : new Date(order.timestamp || Date.now());
                                            return (
                                                <motion.tr
                                                    key={order.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="group hover:bg-primary/[0.02] transition-colors"
                                                >
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col">
                                                            <div className="font-mono text-[10px] uppercase font-bold text-primary/70">#{order.id.slice(0, 12)}</div>
                                                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
                                                                <Calendar size={12} />
                                                                {date.toLocaleDateString()} {date.toLocaleTimeString()}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                                                                <User size={14} className="text-primary/50" />
                                                            </div>
                                                            <div className="text-xs font-bold text-foreground truncate max-w-[200px]">{order.email}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-1.5 bg-green-500/10 rounded-lg">
                                                                <CreditCard size={14} className="text-green-500" />
                                                            </div>
                                                            <div className="font-black italic tracking-tighter text-base">
                                                                ${(order.amount || 0).toLocaleString()}
                                                                <span className="text-[10px] ml-1 opacity-50 uppercase tracking-widest not-italic font-bold">
                                                                    {order.currency || 'USD'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic border ${order.status === 'succeeded' || order.status === 'completed' || order.status === 'paid'
                                                            ? 'bg-green-500/20 text-green-500 border-green-500/20'
                                                            : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20'
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
    );
}
