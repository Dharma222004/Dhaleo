"use client"

import { Button } from "@/components/ui/button"
import { LogIn, UserCircle, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { useSession, signOut, signIn } from "next-auth/react"

export function Navbar() {
    const { data: session } = useSession()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl">
                <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <img src="/logo.png" alt="Dhaleo Logo" className="h-9 w-9 rounded-lg shadow-lg shadow-primary/10" />
                    <span className="text-xl font-black tracking-tighter text-foreground">Dhaleo</span>
                </Link>

                <div className="flex items-center gap-3">
                    {!session && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href="/dashboard" className="hidden sm:inline-flex">
                                        <Button variant="outline" size="sm" className="gap-2 border-border text-muted-foreground hover:bg-white/[0.02] rounded-[10px] font-bold transition-all h-9">
                                            <UserCircle className="h-4 w-4" />
                                            Guest
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className="bg-card text-foreground border-border shadow-2xl">
                                    <p className="font-bold">Unlock full potential!</p>
                                    <p className="text-xs opacity-75">Sign in to save templates.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                    {session ? (
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-xs font-bold leading-none">{session.user?.name}</span>
                                <span className="text-[10px] text-muted-foreground mt-0.5">{session.user?.email}</span>
                            </div>
                            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-primary/30 overflow-hidden shadow-lg">
                                <img
                                    src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}&background=18181B&color=C9A227`}
                                    alt="User Avatar"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <Button
                                onClick={() => signOut()}
                                variant="outline"
                                size="sm"
                                className="font-bold uppercase tracking-tighter border-border rounded-[10px] px-3 sm:px-4 h-8 sm:h-9 text-[10px] sm:text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
                            >
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={() => signIn("google")}
                            size="sm"
                            className="btn-premium bg-primary text-primary-foreground hover:bg-primary/90 rounded-[10px] h-9 px-3 sm:px-4 flex gap-2 google-glow"
                        >
                            <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
                            </svg>
                            <span className="text-xs sm:text-sm font-bold truncate">Sign in</span>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}
