import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    const body = await req.text();
    const sig = (await headers()).get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        if (!endpointSecret) throw new Error('Missing Stripe Webhook Secret');
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutSessionCompleted(session);
                break;
            }
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;
                await handleInvoicePaymentSucceeded(invoice);
                break;
            }
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await handlePaymentIntentSucceeded(paymentIntent);
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const email = session.customer_details?.email || session.customer_email;
    if (!email) {
        console.error('No email found in session', session.id);
        return;
    }

    console.log(`Processing checkout for: ${email}`);

    // 1. Log the Order
    const orderRef = adminDb.collection('orders').doc(session.id);
    await orderRef.set({
        email: email,
        amount: (session.amount_total || 0) / 100, // Convert back to main currency unit
        currency: session.currency,
        status: session.payment_status,
        stripeCustomerId: session.customer,
        timestamp: Timestamp.now(),
        items: session.line_items?.data || [], // Usually need expansion, keeping simple
        metadata: session.metadata || {},
    });

    // 2. Update User Plan
    const usersRef = adminDb.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();

    if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        await userDoc.ref.update({
            stripeCustomerId: session.customer,
            plan: 'pro', // Logic to determine plan based on product ID would go here
            subscriptionStatus: 'active',
            updatedAt: Timestamp.now(),
        });
        console.log(`Updated user ${userDoc.id} to PRO plan`);
    } else {
        console.warn(`User with email ${email} not found during webhook processing.`);
        // Optional: Create a placeholder user?
    }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const email = invoice.customer_email;
    if (!email) return;

    // Log the recurring payment order
    const orderRef = adminDb.collection('orders').doc(invoice.id);
    await orderRef.set({
        email: email,
        amount: (invoice.amount_paid || 0) / 100,
        currency: invoice.currency,
        status: 'paid',
        stripeCustomerId: invoice.customer,
        timestamp: Timestamp.now(),
        type: 'renewal',
    });
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    if (!paymentIntent.metadata?.items) return;

    try {
        const items = JSON.parse(paymentIntent.metadata.items);
        console.log(`Decreasing stock for items`, items);

        for (const item of items) {
            const productRef = adminDb.collection('products').doc(item.id);
            await adminDb.runTransaction(async (transaction) => {
                const productDoc = await transaction.get(productRef);
                if (!productDoc.exists) {
                    console.error(`Product ${item.id} not found during stock update.`);
                    return;
                }

                const currentStock = productDoc.data()?.stock || 0;
                const newStock = Math.max(0, currentStock - item.quantity); // Prevent negative stock

                transaction.update(productRef, { stock: newStock });
            });
        }
    } catch (e) {
        console.error("Error updating stock:", e);
    }
}
