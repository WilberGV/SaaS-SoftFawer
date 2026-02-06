"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"

export function LeadForm() {
    const [submitted, setSubmitted] = React.useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3000)
    }

    if (submitted) {
        return (
            <div className="text-center py-10">
                <h3 className="text-xl font-bold text-green-600 mb-2">¡Solicitud Recibida!</h3>
                <p className="text-muted-foreground">Te contactaremos pronto para tu auditoría privada.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight">Solicitar Auditoría</h3>
                <p className="text-sm text-muted-foreground">Analizaremos tu potencial de automatización gratis.</p>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">Email Corporativo</label>
                <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="email"
                    placeholder="nombre@empresa.com"
                    required
                    type="email"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="phone">WhatsApp</label>
                <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="phone"
                    placeholder="+34 600..."
                    required
                    type="tel"
                />
            </div>
            <Button type="submit" className="w-full">Enviar Solicitud</Button>
        </form>
    )
}
