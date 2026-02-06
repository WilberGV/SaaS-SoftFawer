import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-background border-t border-border py-12 text-muted-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-foreground font-bold text-lg mb-4">SoftFawer</h3>
                    <p className="text-sm">Soluciones de automatización premium para negocios modernos.</p>
                </div>
                <div>
                    <h4 className="text-foreground font-semibold mb-4">Producto</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/marketplace" className="hover:text-accent transition-colors">Marketplace</Link></li>
                        <li><Link href="/#pricing" className="hover:text-accent transition-colors">Precios</Link></li>
                        <li><Link href="/#features" className="hover:text-accent transition-colors">Características</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-foreground font-semibold mb-4">Empresa</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/nosotros" className="hover:text-accent transition-colors">Nosotros</Link></li>
                        <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
                        <li><Link href="/contacto" className="hover:text-accent transition-colors">Contacto</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-foreground font-semibold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/terminos" className="hover:text-accent transition-colors">Términos</Link></li>
                        <li><Link href="/privacidad" className="hover:text-accent transition-colors">Privacidad</Link></li>
                        <li><Link href="/cookies" className="hover:text-accent transition-colors">Cookies</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-border text-sm text-center">
                &copy; {new Date().getFullYear()} SoftFawer. Todos los derechos reservados.
            </div>
        </footer>
    );
}
