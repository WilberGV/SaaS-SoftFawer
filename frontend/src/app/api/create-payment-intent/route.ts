import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { products } from '@/data/products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any, // TypeScript insists on a future version/beta, casting to any to avoid build block.
});

export async function POST(request: Request) {
    try {
        const { items } = await request.json();

        // Verify amount server-side
        let calculatedAmount = 0;

        // Check if items is an array
        if (!Array.isArray(items)) {
            throw new Error('Invalid items format');
        }

        for (const item of items) {
            const product = products.find(p => p.id === item.id);
            if (!product) {
                throw new Error(`Product ${item.id} not found`);
            }
            calculatedAmount += product.price * item.quantity;
        }

        if (calculatedAmount === 0) {
            throw new Error('Total amount is 0');
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(calculatedAmount * 100), // Convert to cents
            currency: 'eur',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                items: JSON.stringify(items.map((i: any) => ({ id: i.id, quantity: i.quantity })))
            }
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Internal Error:', error);
        return NextResponse.json(
            { error: `Internal Server Error: ${error}` },
            { status: 500 }
        );
    }
}
