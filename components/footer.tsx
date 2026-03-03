"use client"

import { Heart } from "lucide-react"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="w-full border-t border-white/5 bg-card/10 py-16 mt-20 relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col items-center text-center gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3 text-2xl font-semibold tracking-tight">
                            <span>Made with Love and Profit</span>
                            <span className="text-3xl animate-pulse">💚</span>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-base md:text-lg font-black tracking-[0.2em] uppercase text-muted-foreground/80">
                                Product of Market Healers
                            </h2>
                            <p className="text-xs md:text-sm text-muted-foreground/40 font-medium tracking-wide">
                                © {new Date().getFullYear()} Dhaleo. All rights reserved.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 group">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/25">
                            Ruzhaa-AI Powered Financial Assistant
                        </p>
                        <Link
                            href="https://www.ruzhaa.online/"
                            target="_blank"
                            className="transition-all duration-500 hover:scale-105 active:scale-95"
                        >
                            <div className="relative">
                                <div className="absolute -inset-6 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <img
                                    src="/ruzhaa.jpg"
                                    alt="Ruzhaa Logo"
                                    className="h-16 w-16 md:h-20 md:w-20 rounded-2xl shadow-2xl border border-white/10 relative z-10 brightness-90 group-hover:brightness-110 transition-all duration-500"
                                />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
