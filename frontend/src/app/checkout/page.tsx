'use client';

import { useCart } from '@/context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
    const { cartTotal, items, clearCart } = useCart();
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        if (items.length > 0) {
            fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items, amount: cartTotal }),
            })
                .then((res) => res.json())
                .then((data) => setClientSecret(data.clientSecret));
        }
    }, [items, cartTotal]);

    if (items.length === 0) return (
        <div className="p-10 text-center min-h-screen pt-32">
            <h1 className="text-2xl font-bold mb-4">El carrito está vacío</h1>
            <p className="text-muted-foreground mb-8">Parece que aún no has seleccionado ningún agente.</p>
        </div>
    );

    const options = {
        clientSecret,
        appearance: {
            theme: 'night' as const,
            variables: {
                colorPrimary: '#3b82f6',
            },
        },
    };

    return (
        <div className="min-h-screen bg-background pt-32 pb-12 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-mesh opacity-20 pointer-events-none" />
            <div className="max-w-xl mx-auto relative z-10">
                <h1 className="text-3xl font-bold text-foreground mb-8 text-center font-serif">Pago Seguro</h1>
                <div className="bg-card border border-border p-8 rounded-3xl shadow-xl mb-8">
                    <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
                    <ul className="space-y-4 mb-6">
                        {items.map((item) => (
                            <li key={item.id} className="flex justify-between items-center text-sm">
                                <span>{item.name} (x{item.quantity})</span>
                                <span className="font-bold">{item.price * item.quantity}€</span>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t border-border pt-4 flex justify-between items-baseline">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-bold text-primary">{cartTotal}€/mes</span>
                    </div>
                </div>

                {clientSecret && (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm clearCart={clearCart} />
                    </Elements>
                )}
            </div>
        </div>
    );
}

function CheckoutForm({ clearCart }: { clearCart: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!stripe) return;

        const clientSecret = new URLSearchParams(window.location.search).get(
            'payment_intent_client_secret'
        );

        if (!clientSecret) return;

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent?.status) {
                case 'succeeded':
                    setMessage('¡Pago realizado con éxito!');
                    clearCart();
                    break;
                case 'processing':
                    setMessage('Su pago se está procesando.');
                    break;
                case 'requires_payment_method':
                    setMessage('El pago no se ha podido realizar, por favor inténtelo de nuevo.');
                    break;
                default:
                    setMessage('Algo ha salido mal.');
                    break;
            }
        });
    }, [stripe, clearCart]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/dashboard`,
            },
        });

        if (error.type === 'card_error' || error.type === 'validation_error') {
            setMessage(error.message || 'Ha ocurrido un error inesperado.');
        } else {
            setMessage('Ha ocurrido un error inesperado.');
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="bg-card p-8 rounded-3xl border border-border shadow-xl">
            <PaymentElement id="payment-element" />
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="mt-8 w-full py-4 bg-primary rounded-2xl text-primary-foreground font-bold disabled:opacity-50 hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-xl shadow-primary/20"
            >
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner">Procesando...</div> : 'Pagar ahora'}
                </span>
            </button>
            {message && <div id="payment-message" className="mt-6 text-center text-red-500 font-medium">{message}</div>}
        </form>
    );
}
