"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const DialogContext = React.createContext<{
    open: boolean
    setOpen: (open: boolean) => void
} | null>(null)

export const Dialog = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = React.useState(false)
    return (
        <DialogContext.Provider value={{ open, setOpen }}>
            {children}
        </DialogContext.Provider>
    )
}

export const DialogTrigger = ({ asChild, children }: { asChild?: boolean, children: React.ReactNode }) => {
    const context = React.useContext(DialogContext)
    if (!context) throw new Error("DialogTrigger must be used within Dialog")

    // Naive implementation handling both direct elements and passed elements
    // Since we don't have Radix Slot, we assume children is a single clickable element if asChild is true
    // For safety, we'll wrap in a generic handler div if not asChild, or cloneElement if it is.

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: (e: React.MouseEvent) => {
                children.props.onClick?.(e);
                context.setOpen(true);
            }
        });
    }

    return (
        <button onClick={() => context.setOpen(true)}>{children}</button>
    )
}

export const DialogContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const context = React.useContext(DialogContext)
    if (!context) throw new Error("DialogContent must be used within Dialog")

    if (!context.open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => context.setOpen(false)}
            />
            {/* Content */}
            <div className={cn("relative z-50 grid w-full max-w-lg gap-4 bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full", className)}>
                {children}
                <button
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    onClick={() => context.setOpen(false)}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
            </div>
        </div>
    )
}
