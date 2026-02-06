import * as admin from 'firebase-admin';
import { config } from 'dotenv';
import path from 'path';

config();

// Check if already initialized
if (!admin.apps.length) {
    try {
        // Try to load credentials from file or env
        // In a real environment, you might pass the JSON object via env var
        // For this local setup, we rely on GOOGLE_APPLICATION_CREDENTIALS env var 
        // which firebase-admin automatically picks up if set.
        // OR we can explicitly initialize if we have the file
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: process.env.FIREBASE_PROJECT_ID
        });
        console.log('Firebase Admin initialized');
    } catch (e) {
        console.error('Failed to initialize Firebase Admin', e);
    }
}

export const db = admin.firestore();
