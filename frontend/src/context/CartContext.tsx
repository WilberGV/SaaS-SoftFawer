'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    cartTotal: number;
}

const CartContext = createContext<CartContextType>({
    items: [],
    addToCart: () => { },
    removeFromCart: () => { },
    clearCart: () => { },
    cartTotal: 0,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setItems(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const clearCart = () => setItems([]);

    const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
