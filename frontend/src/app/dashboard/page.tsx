'use client';

import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Settings, CreditCard, LayoutDashboard, RefreshCw } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { TenantSession } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import RevenueChart from '@/components/RevenueChart';

const BotControl = dynamic(() => import('@/components/BotControl'), {
    loading: () => <div className="p-8 glass-effect rounded-2xl animate-pulse text-center text-xs uppercase tracking-widest text-muted-foreground">Inicializando Control...</div>
});

export default function DashboardPage() {
    return (
        <AuthGuard>
            <DashboardContent />
        </AuthGuard>
    );
}

function DashboardContent() {
    const { user, appUser, isSuperAdmin } = useAuth();
    const router = useRouter();
    const [sessions, setSessions] = useState<TenantSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [adminStats, setAdminStats] = useState({ users: 0, revenue: 0, bots: 0 });
    const [revenueData, setRevenueData] = useState<{ label: string, value: number }[]>([]);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const data = await api.getSessions();
            setSessions(data.sessions || []);
        } catch (e) {
            console.error("Failed to fetch sessions", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
        if (isSuperAdmin && db) {
            const fetchAdminStats = async () => {
                try {
                    const [usersSnap, productsSnap, ordersSnap] = await Promise.all([
                        getDocs(collection(db!, 'users')),
                        getDocs(collection(db!, 'products')),
                        getDocs(collection(db!, 'orders'))
                    ]);

                    const totalRevenue = ordersSnap.docs.reduce((acc, doc) => {
                        const data = doc.data();
                        return acc + (data.total || data.amount || 0);
                    }, 0);

                    // Aggregate revenue by month
                    const last6Months = Array.from({ length: 6 }).map((_, i) => {
                        const d = new Date();
                        d.setMonth(d.getMonth() - (5 - i));
                        return {
                            month: d.toLocaleString('default', { month: 'short' }),
                            year: d.getFullYear(),
                            total: 0
                        };
                    });

                    ordersSnap.docs.forEach(doc => {
                        const data = doc.data();
                        const date = data.timestamp?.toDate() || new Date();
                        const monthStr = date.toLocaleString('default', { month: 'short' });
                        const year = date.getFullYear();

                        const monthData = last6Months.find(m => m.month === monthStr && m.year === year);
                        if (monthData) {
                            monthData.total += (data.total || data.amount || 0);
                        }
                    });

                    setRevenueData(last6Months.map(m => ({ label: m.month, value: m.total })));

                    setAdminStats(prev => ({
                        ...prev,
                        users: usersSnap.size,
                        revenue: totalRevenue
                    }));
                } catch (e) {
                    console.error("Error fetching admin stats:", e);
                }
            };
            fetchAdminStats();
        }
    }, [isSuperAdmin]);

    const handleLogout = async () => {
        if (auth) await signOut(auth);
        router.push('/');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="min-h-screen bg-background bg-grid-mesh pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-7xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header */}
                <motion.div
                    variants={itemVariants}
                    className="mb-8 flex justify-between items-center glass-effect p-8 rounded-3xl"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-foreground tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-2">Welcome back, <span className="text-primary font-medium">{user?.email}</span></p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/billing"
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all active:scale-95"
                        >
                            <CreditCard size={18} />
                            <span className="font-medium">Facturación</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-5 py-2.5 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition-all active:scale-95"
                        >
                            <LogOut size={18} />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </motion.div>

                {/* Bento Grid Stats */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ${isSuperAdmin ? 'opacity-100' : ''}`}>
                    <StatCard
                        icon={<LayoutDashboard />}
                        label={isSuperAdmin ? "Instancias Globales" : "Mis Bots Activos"}
                        value={isSuperAdmin ? sessions.length.toString() : sessions.filter(s => s.connected).length.toString()}
                        delay={0.1}
                    />
                    <StatCard
                        icon={<CreditCard />}
                        label={isSuperAdmin ? "Total Revenue" : "Spending"}
                        value={isSuperAdmin ? `$${adminStats.revenue.toLocaleString()}` : "$0.00"}
                        delay={0.2}
                    />
                    <StatCard
                        icon={<Settings />}
                        label={isSuperAdmin ? "Total Users" : "Total Requests"}
                        value={isSuperAdmin ? adminStats.users.toString() : "0"}
                        delay={0.3}
                    />
                </div>

                {isSuperAdmin && (
                    <motion.div variants={itemVariants} className="mb-8">
                        <RevenueChart data={revenueData} />
                    </motion.div>
                )}

                {isSuperAdmin && (
                    <motion.div
                        variants={itemVariants}
                        className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        <AdminQuickLink
                            title="Gestión Usuarios"
                            description="Administra roles y permisos"
                            href="/dashboard/admin/users"
                            color="bg-primary"
                        />
                        <AdminQuickLink
                            title="Inventario"
                            description="Marketplace y productos"
                            href="/dashboard/admin/products"
                            color="bg-accent"
                        />
                        <AdminQuickLink
                            title="Webhooks"
                            description="Estado del Gateway"
                            href="/dashboard/admin/system"
                            color="bg-secondary"
                        />
                        <AdminQuickLink
                            title="Logs"
                            description="Eventos del sistema"
                            href="/dashboard/admin/logs"
                            color="bg-muted"
                        />
                        <AdminQuickLink
                            title="Pedidos"
                            description="Ventas y transacciones"
                            href="/dashboard/admin/orders"
                            color="bg-green-500"
                        />
                        <AdminQuickLink
                            title="Ajustes Globales"
                            description="Configuración de la plataforma"
                            href="/dashboard/admin/settings"
                            color="bg-orange-500"
                        />
                    </motion.div>
                )}

                {/* Content Area */}
                <motion.div
                    variants={itemVariants}
                    className="glass-effect rounded-3xl min-h-[450px] p-8"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">Your Deployments</h2>
                            <p className="text-sm text-muted-foreground mt-1">Manage and monitor your active instances</p>
                        </div>
                        <button
                            onClick={fetchSessions}
                            className="p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-all active:rotate-180"
                            title="Refresh Status"
                        >
                            <RefreshCw size={20} className={`text-foreground ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4">
                            <RefreshCw size={32} className="animate-spin text-primary/50" />
                            <p className="animate-pulse">Loading your bots...</p>
                        </div>
                    ) : (sessions.filter(s => isSuperAdmin || s.tenantId === appUser?.tenantId).length === 0) ? (
                        <div className="text-center py-24 glass-effect rounded-2xl border-dashed border-2 border-primary/10">
                            <p className="text-muted-foreground text-lg mb-6">
                                {appUser?.tenantId ? "Your instance is ready for deployment." : "No active bots found. Launch your first one today!"}
                            </p>
                            {appUser?.tenantId ? (
                                <div className="max-w-md mx-auto">
                                    <BotControl
                                        tenantId={appUser.tenantId}
                                        onStatusChange={fetchSessions}
                                    />
                                </div>
                            ) : (
                                <a href="/marketplace" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-transform shadow-xl shadow-primary/20">
                                    Browse Marketplace
                                </a>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sessions
                                .filter(s => isSuperAdmin || s.tenantId === appUser?.tenantId)
                                .map(session => (
                                    <motion.div
                                        key={session.tenantId}
                                        whileHover={{ y: -5 }}
                                        className="p-6 glass-effect rounded-2xl group transition-all"
                                    >
                                        <BotControl
                                            tenantId={session.tenantId}
                                            onStatusChange={fetchSessions}
                                        />
                                    </motion.div>
                                ))}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}

function StatCard({ icon, label, value, delay }: { icon: React.ReactNode, label: string, value: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="glass-effect p-8 rounded-3xl flex items-center gap-6 group hover:shadow-2xl hover:shadow-primary/5 transition-all"
        >
            <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-black text-foreground mt-1">{value}</p>
            </div>
        </motion.div>
    );
}
function AdminQuickLink({ title, description, href, color }: { title: string, description: string, href: string, color: string }) {
    return (
        <Link href={href}>
            <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-effect p-6 rounded-2xl border-primary/5 hover:border-primary/20 transition-all cursor-pointer h-full"
            >
                <div className={`w-10 h-1 h-1 rounded-full mb-4 ${color}`} />
                <h3 className="font-bold text-foreground mb-1">{title}</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{description}</p>
            </motion.div>
        </Link>
    );
}
