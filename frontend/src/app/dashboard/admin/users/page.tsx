'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { User as AppUser } from '@/types';
import { Users, Shield, UserCheck, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserManagementPage() {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        if (!db) return;
        try {
            setLoading(true);
            const q = query(collection(db!, 'users'));
            const querySnapshot = await getDocs(q);
            const fetchedUsers = querySnapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            } as AppUser));
            setUsers(fetchedUsers);
        } catch (e) {
            console.error("Error fetching users:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (uid: string, newRole: AppUser['role']) => {
        if (!db) return;
        try {
            const userRef = doc(db!, 'users', uid);
            await updateDoc(userRef, { role: newRole });
            setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
        } catch (e) {
            console.error("Error updating role:", e);
        }
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                <Users size={24} />
                            </div>
                            <h1 className="text-3xl font-black uppercase tracking-tighter">Gestión de Usuarios</h1>
                        </div>
                        <p className="text-muted-foreground text-sm italic">Administra los accesos y roles de la plataforma SoftFawer.</p>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por email o nombre..."
                            className="w-full pl-12 pr-4 py-3 bg-primary/5 border border-primary/10 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all italic text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="glass-effect rounded-3xl overflow-hidden shadow-2xl border-primary/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-primary/5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">
                                    <th className="px-8 py-6">Usuario</th>
                                    <th className="px-8 py-6">Rol</th>
                                    <th className="px-8 py-6">Estado</th>
                                    <th className="px-8 py-6">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                <AnimatePresence mode="popLayout">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Cargando base de datos...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center text-muted-foreground italic">
                                                No se encontraron usuarios que coincidan con la búsqueda.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user, idx) => (
                                            <motion.tr
                                                key={user.uid}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="group hover:bg-primary/[0.02] transition-colors"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary animate-pulse italic">
                                                            {user.displayName?.[0] || user.email[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-foreground">{user.displayName || 'Usuario sin nombre'}</div>
                                                            <div className="text-xs text-muted-foreground italic">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic border ${user.role === 'superadmin' ? 'bg-primary/20 text-primary border-primary/20' :
                                                        user.role === 'admin' ? 'bg-accent/20 text-accent border-accent/20' :
                                                            'bg-muted/20 text-muted-foreground border-muted/20'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                                        <span className="text-[10px] uppercase font-black tracking-tighter opacity-70">Activo</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            disabled={user.role === 'superadmin' && user.email === 'wegvivas@gmail.com'}
                                                            className="bg-primary/5 border border-primary/10 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                            value={user.role}
                                                            onChange={(e) => handleRoleChange(user.uid, e.target.value as any)}
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="author">Author</option>
                                                            <option value="editor">Editor</option>
                                                            <option value="admin">Admin</option>
                                                            <option value="superadmin">SuperAdmin</option>
                                                        </select>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
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
