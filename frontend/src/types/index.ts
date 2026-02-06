export interface Product {
    id: string;
    name: string;
    category: string;
    categorySlug: string;
    description: string;
    longDescription: string;
    price: number;
    badge?: string;
    features: string[];
    benefits: string[];
    useCases: string[];
    roi: string;
    slug: string;
    icon: string;
    popular?: boolean;
    setupTime: string;
    difficulty: 'Fácil' | 'Medio' | 'Avanzado';
    integrations?: string[];
    image?: string; // Mantener por compatibilidad con carrito existente
    stock?: number;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    productCount: number;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    tldr?: string; // Answer Engine Optimization
    content: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    tags: string[];
}

export interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface User {
    uid: string;
    email: string;
    displayName: string | null;
    role: 'user' | 'admin' | 'superadmin' | 'editor' | 'author' | 'collaborator';
    purchases: string[];
    createdAt: any;
    tenantId?: string;
}

export interface TenantSession {
    tenantId: string;
    connected: boolean;
    status: any;
}

export interface GatewayStatus {
    status: string;
    uptime: number;
    connections: number;
    version: string;
}
