import { useState } from 'react';
import { Category } from '@/types';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductFiltersProps {
    categories: Category[];
    selectedCategory: string | null;
    onCategoryChange: (slug: string | null) => void;
    priceRange: [number, number];
    onPriceChange: (range: [number, number]) => void;
    difficulty: string | null;
    onDifficultyChange: (difficulty: string | null) => void;
}

export default function ProductFilters({
    categories,
    selectedCategory,
    onCategoryChange,
    priceRange,
    onPriceChange,
    difficulty,
    onDifficultyChange,
}: ProductFiltersProps) {
    const difficulties = ['Fácil', 'Medio', 'Avanzado'];
    const [openSections, setOpenSections] = useState({
        categories: true,
        price: true,
        difficulty: true
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <aside className="space-y-6">
            {/* Categorías */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <button
                    onClick={() => toggleSection('categories')}
                    className="w-full p-6 flex items-center justify-between group"
                >
                    <h3 className="font-bold text-lg text-foreground">Categorías</h3>
                    <ChevronDown
                        size={20}
                        className={`text-muted-foreground transition-transform duration-300 ${openSections.categories ? 'rotate-180' : ''}`}
                    />
                </button>
                <AnimatePresence>
                    {openSections.categories && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            <div className="px-6 pb-6 pt-0 space-y-1">
                                <button
                                    onClick={() => onCategoryChange(null)}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${selectedCategory === null
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'hover:bg-muted text-muted-foreground'
                                        }`}
                                >
                                    Todas las categorías
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => onCategoryChange(cat.slug)}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${selectedCategory === cat.slug
                                            ? 'bg-primary text-primary-foreground shadow-md'
                                            : 'hover:bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        <span className="text-lg">{cat.icon}</span>
                                        <span className="text-sm font-medium">{cat.name}</span>
                                        <span className={`ml-auto text-xs ${selectedCategory === cat.slug ? 'text-primary-foreground/80' : 'text-muted-foreground/60'}`}>
                                            ({cat.productCount})
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Rango de Precio */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <button
                    onClick={() => toggleSection('price')}
                    className="w-full p-6 flex items-center justify-between group"
                >
                    <h3 className="font-bold text-lg text-foreground">Rango de Precio</h3>
                    <ChevronDown
                        size={20}
                        className={`text-muted-foreground transition-transform duration-300 ${openSections.price ? 'rotate-180' : ''}`}
                    />
                </button>
                <AnimatePresence>
                    {openSections.price && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            <div className="px-6 pb-6 pt-0 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Mín</label>
                                        <input
                                            type="number"
                                            value={priceRange[0]}
                                            onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            min="0"
                                        />
                                    </div>
                                    <span className="text-muted-foreground mt-4">-</span>
                                    <div className="flex-1">
                                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Máx</label>
                                        <input
                                            type="number"
                                            value={priceRange[1]}
                                            onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <p className="text-[11px] text-muted-foreground text-center">Precios en Euros (€) por mes</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Dificultad */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <button
                    onClick={() => toggleSection('difficulty')}
                    className="w-full p-6 flex items-center justify-between group"
                >
                    <h3 className="font-bold text-lg text-foreground">Dificultad</h3>
                    <ChevronDown
                        size={20}
                        className={`text-muted-foreground transition-transform duration-300 ${openSections.difficulty ? 'rotate-180' : ''}`}
                    />
                </button>
                <AnimatePresence>
                    {openSections.difficulty && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            <div className="px-6 pb-6 pt-0 grid grid-cols-1 gap-2">
                                {difficulties.map((diff) => (
                                    <button
                                        key={diff}
                                        onClick={() => onDifficultyChange(difficulty === diff ? null : diff)}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm font-medium ${difficulty === diff
                                            ? 'bg-primary text-primary-foreground shadow-md'
                                            : 'hover:bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </aside>
    );
}
