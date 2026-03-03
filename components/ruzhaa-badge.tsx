"use client"

import Link from "next/link"

export function RuzhaaBadge() {
    return (
        <Link
            href="https://www.ruzhaa.online/"
            target="_blank"
            className="fixed bottom-6 right-6 z-[100] group transition-all duration-500 hover:scale-110 active:scale-95 hidden md:block"
        >
            <div className="relative">
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                    src="/ruzhaa.jpg"
                    alt="Ruzhaa Logo"
                    className="h-16 w-16 rounded-2xl shadow-2xl border border-white/10 relative z-10 brightness-110 group-hover:brightness-125 transition-all grayscale-[0.2] group-hover:grayscale-0"
                />

            </div>
        </Link>
    )
}
