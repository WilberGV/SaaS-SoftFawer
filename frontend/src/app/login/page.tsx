'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, ArrowRight, Bot, Chrome } from 'lucide-react';

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { signIn, signUp, signInWithGoogle } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isSignUp) {
                await signUp(email, password, name);
            } else {
                await signIn(email, password);
            }
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use' || err.message.includes('already-in-use')) {
                setError('Este correo electrónico ya está registrado.');
            } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.message.includes('invalid-credential')) {
                setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
            } else {
                setError(isSignUp ? 'Error al crear la cuenta. Por favor, inténtalo de nuevo.' : 'Error al iniciar sesión. Comprueba tus credenciales.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setIsLoading(true);
        try {
            await signInWithGoogle();
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError('Error al iniciar sesión con Google.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background relative flex items-center justify-center py-20 px-4 overflow-hidden">
            {/* High-End Background Mesh */}
            <div className="absolute inset-0 bg-grid-mesh opacity-20 pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        className="inline-flex items-center justify-center w-20 h-20 glass-effect border-primary/20 rounded-[2.2rem] mb-8 shadow-2xl relative group"
                    >
                        <div className="absolute inset-4 bg-primary/10 rounded-2xl animate-pulse" />
                        <Bot className="text-primary relative z-10" size={32} />
                    </motion.div>
                    <h2 className="text-4xl font-black tracking-tighter text-foreground mb-3 leading-none">
                        {isSignUp ? 'CREA TU' : 'BIENVENIDO'} <br />
                        <span className="text-primary italic">{isSignUp ? 'CUENTA.' : 'DE NUEVO.'}</span>
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium italic">
                        {isSignUp ? 'Inicia la automatización de tu imperio.' : 'Accede al centro de operaciones.'}
                    </p>
                </div>

                <div className="glass-effect p-8 rounded-[2.5rem] border-primary/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-mesh opacity-5 pointer-events-none" />

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full py-4 bg-white/5 border border-white/10 rounded-[1.2rem] flex items-center justify-center gap-3 hover:bg-white/10 transition-all mb-8 group"
                    >
                        <Chrome size={20} className="text-primary" />
                        <span className="font-bold text-sm tracking-widest italic uppercase">Continuar con Google</span>
                    </button>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-primary/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-transparent text-muted-foreground font-black tracking-[0.2em] uppercase">o vía correo</span>
                        </div>
                    </div>

                    <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-red-500 text-center text-[10px] font-black uppercase tracking-widest italic"
                                >
                                    ⚠️ {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-4">
                            {isSignUp && (
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-14 pr-6 py-4 bg-primary/5 border border-primary/10 rounded-[1.2rem] text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50 text-sm font-medium italic"
                                        placeholder="Nombre completo"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            )}
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-14 pr-6 py-4 bg-primary/5 border border-primary/10 rounded-[1.2rem] text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50 text-sm font-medium italic"
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-14 pr-6 py-4 bg-primary/5 border border-primary/10 rounded-[1.2rem] text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50 text-sm font-medium italic"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-primary text-white rounded-[1.2rem] font-black text-lg hover:shadow-2xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 group"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isSignUp ? 'REGISTRARSE' : 'ACCEDER'}
                                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-primary/10 text-center relative z-10">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-[9px] text-muted-foreground hover:text-primary font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 mx-auto group"
                        >
                            {isSignUp ? (
                                <><LogIn size={14} className="group-hover:-translate-x-1 transition-transform" /> YA TENGO UNA CUENTA</>
                            ) : (
                                <><UserPlus size={14} className="group-hover:scale-110 transition-transform" /> SOLICITAR ACCESO NUEVO</>
                            )}
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-center text-[9px] text-muted-foreground uppercase tracking-[0.4em] font-black opacity-40">
                    SISTEMA DE SEGURIDAD SOFTFAWER • v3.0
                </p>
            </motion.div>
        </main>
    );
}
