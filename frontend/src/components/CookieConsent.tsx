'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';
import { Button } from './ui/button';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[100]"
                >
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                                    <Cookie size={24} />
                                </div>
                                <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                                    Cookies & Privacidad
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Utilizamos cookies para optimizar tu experiencia, analizar el tráfico y
                            personalizar el contenido de nuestros servicios de IA corporativa.
                            Al hacer clic en "Aceptar", consientes su uso.{" "}
                            <Link href="/cookies" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                                Más información
                            </Link>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2 mt-2">
                            <Button
                                onClick={handleAccept}
                                className="flex-1 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 rounded-xl"
                            >
                                Aceptar Todo
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleDecline}
                                className="flex-1 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300"
                            >
                                Configurar
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
