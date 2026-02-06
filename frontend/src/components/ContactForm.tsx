'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });

            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Nombre completo *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-border rounded-lg py-3 px-4 focus:outline-none focus:border-accent transition-colors bg-background text-foreground"
                    placeholder="Tu nombre"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email *
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-border rounded-lg py-3 px-4 focus:outline-none focus:border-accent transition-colors bg-background text-foreground"
                    placeholder="tu@email.com"
                />
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Teléfono (opcional)
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-border rounded-lg py-3 px-4 focus:outline-none focus:border-accent transition-colors bg-background text-foreground"
                    placeholder="+34 600 000 000"
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Mensaje *
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full border border-border rounded-lg py-3 px-4 focus:outline-none focus:border-accent transition-colors resize-none bg-background text-foreground"
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                />
            </div>

            <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {status === 'sending' ? (
                    'Enviando...'
                ) : (
                    <>
                        Enviar mensaje
                        <Send size={18} />
                    </>
                )}
            </button>

            {status === 'success' && (
                <div className="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-lg text-sm">
                    ✓ Mensaje enviado correctamente. Te responderemos pronto.
                </div>
            )}

            {status === 'error' && (
                <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg text-sm">
                    ✗ Hubo un error. Por favor, inténtalo de nuevo.
                </div>
            )}
        </form>
    );
}
