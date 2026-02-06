'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { Product } from '@/types';
import { Package, Plus, Search, Edit2, Trash2, ArrowLeft, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ProductManagementPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

    const fetchProducts = async () => {
        if (!db) return;
        try {
            setLoading(true);
            const q = collection(db!, 'products');
            const querySnapshot = await getDocs(q);
            const fetchedProducts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Product));
            setProducts(fetchedProducts);
        } catch (e) {
            console.error("Error fetching products:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!db || !confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await deleteDoc(doc(db!, 'products', id));
            setProducts(products.filter(p => p.id !== id));
        } catch (e) {
            console.error("Error deleting product:", e);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!db || !editingProduct) return;
        try {
            const id = editingProduct.id || Math.random().toString(36).substring(7);
            await setDoc(doc(db!, 'products', id), {
                ...editingProduct,
                id
            }, { merge: true });

            setIsEditing(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (e) {
            console.error("Error saving product:", e);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 glass-effect rounded-lg hover:text-primary transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 bg-accent/10 text-accent rounded-lg">
                                    <Package size={24} />
                                </div>
                                <h1 className="text-3xl font-black uppercase tracking-tighter">Inventario</h1>
                            </div>
                            <p className="text-muted-foreground text-sm italic">Gestiona los productos y servicios del Marketplace.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-grow group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                className="w-full pl-12 pr-4 py-3 bg-accent/5 border border-accent/10 rounded-2xl focus:ring-2 focus:ring-accent/20 outline-none transition-all italic text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => {
                                setEditingProduct({
                                    name: '',
                                    category: '',
                                    stock: 0,
                                    price: 0,
                                    features: [],
                                    benefits: [],
                                    useCases: [],
                                    description: '',
                                    longDescription: '',
                                    roi: '',
                                    setupTime: '',
                                    difficulty: 'Fácil',
                                    integrations: [],
                                    categorySlug: '',
                                    slug: '',
                                    icon: 'Zap'
                                });
                                setIsEditing(true);
                            }}
                            className="p-3 bg-accent text-accent-foreground rounded-2xl hover:scale-105 transition-all shadow-xl shadow-accent/20 flex items-center gap-2"
                        >
                            <Plus size={24} />
                            <span className="hidden md:inline font-bold uppercase text-xs tracking-widest">Nuevo</span>
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {isEditing && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        >
                            <div className="glass-effect w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 rounded-[3rem] border-accent/20 shadow-2xl relative">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>

                                <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 italic">
                                    {editingProduct?.id ? 'Editar Producto' : 'Nuevo Producto'}
                                </h2>

                                <form onSubmit={handleSave} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2 italic">Nombre</label>
                                            <input
                                                required
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold italic"
                                                value={editingProduct?.name || ''}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2 italic">Categoría</label>
                                            <input
                                                required
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold italic"
                                                value={editingProduct?.category || ''}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2 italic">Precio ($)</label>
                                            <input
                                                type="number"
                                                required
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold italic"
                                                value={editingProduct?.price || 0}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2 italic">Stock</label>
                                            <input
                                                type="number"
                                                required
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold italic"
                                                value={editingProduct?.stock || 0}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2 italic">Slug</label>
                                            <input
                                                required
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold italic font-mono"
                                                value={editingProduct?.slug || ''}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2 italic">Descripción Corta</label>
                                        <textarea
                                            required
                                            rows={2}
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold italic"
                                            value={editingProduct?.description || ''}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2 italic">Descripción Larga (Markdown)</label>
                                        <textarea
                                            required
                                            rows={4}
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold italic"
                                            value={editingProduct?.longDescription || ''}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, longDescription: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2 italic">ROI (Retorno de Inversión)</label>
                                            <input
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold italic"
                                                value={editingProduct?.roi || ''}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, roi: e.target.value })}
                                                placeholder="Ej: Ahorra 20h/semana"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2 italic">Tiempo de Setup</label>
                                            <input
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold italic"
                                                value={editingProduct?.setupTime || ''}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, setupTime: e.target.value })}
                                                placeholder="Ej: 5 minutos"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2 italic">Features (Separadas por comas)</label>
                                        <textarea
                                            rows={2}
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold italic"
                                            value={editingProduct?.features?.join(', ') || ''}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, features: e.target.value.split(',').map(s => s.trim()) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2 italic">Beneficios (Separados por comas)</label>
                                        <textarea
                                            rows={2}
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold italic"
                                            value={editingProduct?.benefits?.join(', ') || ''}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, benefits: e.target.value.split(',').map(s => s.trim()) })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2 italic">Casos de Uso (Separados por comas)</label>
                                        <textarea
                                            rows={2}
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold italic"
                                            value={editingProduct?.useCases?.join(', ') || ''}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, useCases: e.target.value.split(',').map(s => s.trim()) })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2 italic">Dificultad</label>
                                            <select
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold italic"
                                                value={editingProduct?.difficulty || 'Fácil'}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, difficulty: e.target.value as any })}
                                            >
                                                <option value="Fácil">Fácil</option>
                                                <option value="Medio">Medio</option>
                                                <option value="Avanzado">Avanzado</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2 italic">Integraciones (Separadas por comas)</label>
                                            <input
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold italic"
                                                value={editingProduct?.integrations?.join(', ') || ''}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, integrations: e.target.value.split(',').map(s => s.trim()) })}
                                                placeholder="Ej: Zapier, Stripe, WhatsApp"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-grow py-5 bg-accent text-accent-foreground rounded-[1.2rem] font-black text-lg hover:shadow-2xl hover:shadow-accent/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                                        >
                                            <Save size={24} />
                                            GUARDAR PRODUCTO
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-8 py-5 border border-white/10 rounded-[1.2rem] font-black text-muted-foreground hover:bg-white/5 transition-all text-xs tracking-widest uppercase italic"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="glass-effect p-8 rounded-3xl h-64 animate-pulse bg-white/5" />
                            ))
                        ) : filteredProducts.length === 0 ? (
                            <div className="col-span-full py-20 text-center glass-effect rounded-3xl border-dashed">
                                <p className="text-muted-foreground italic text-lg uppercase tracking-widest font-black opacity-30">No hay productos en el inventario</p>
                            </div>
                        ) : (
                            filteredProducts.map((p, idx) => (
                                <motion.div
                                    key={p.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="glass-effect p-8 rounded-3xl group border-primary/5 hover:border-accent/30 transition-all relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[40px] rounded-full -mr-10 -mt-10 group-hover:bg-accent/20 transition-all" />

                                    <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                                        <div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-accent mb-1 block">
                                                {p.category}
                                            </span>
                                            <h3 className="text-xl font-bold truncate max-w-[180px]">{p.name}</h3>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black italic tracking-tighter">${p.price}</div>
                                            <div className="text-[10px] uppercase tracking-widest font-bold opacity-50 mt-1">Stock: {p.stock || 0}</div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground italic line-clamp-2 mb-8 opacity-70 group-hover:opacity-100 transition-opacity">
                                        {p.description}
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                setEditingProduct(p);
                                                setIsEditing(true);
                                            }}
                                            className="flex-grow py-3 bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/40 rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest italic"
                                        >
                                            <Edit2 size={14} />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="p-3 bg-destructive/5 hover:bg-destructive/20 border border-destructive/10 hover:border-destructive/40 rounded-xl transition-all group/trash"
                                        >
                                            <Trash2 size={16} className="text-destructive group-hover/trash:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
