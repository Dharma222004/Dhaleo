"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowRight, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { signIn, useSession } from "next-auth/react"

export default function LandingPage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-background premium-gradient bg-grid flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-10 relative z-10">

        {/* Logo + Heading */}
        <div className="flex flex-col items-center text-center space-y-6">
          <img
            src="/logo.png"
            alt="Dhaleo Logo"
            className="h-20 w-20 rounded-2xl shadow-xl shadow-primary/20"
          />

          <div className="space-y-4 mb-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-foreground font-[family-name:var(--font-outfit)]">
              Dhaleo <span className="text-primary italic">Screener</span>
            </h1>

            <p className="text-[10px] md:text-xs font-black text-muted-foreground/40 tracking-[0.3em] font-[family-name:var(--font-plus-jakarta)] uppercase">
              AI-powered Indian market intelligence
            </p>
          </div>
        </div>

        {/* Card */}
        <Card className="border border-white/5 shadow-2xl p-4 bg-card/50 backdrop-blur-xl rounded-2xl">

          <CardHeader className="text-center space-y-4 pb-8">
            <CardTitle className="text-2xl md:text-3xl font-black tracking-tight leading-snug font-[family-name:var(--font-outfit)] balance">
              {session
                ? `Welcome, ${session.user?.name?.split(" ")[0]}`
                : "Screen with Intelligence. Invest with Conviction."}
            </CardTitle>

            <CardDescription className="text-sm md:text-base font-medium text-muted-foreground/60 font-[family-name:var(--font-plus-jakarta)] max-w-[280px] md:max-w-none mx-auto leading-relaxed">
              {session
                ? "Your workspace is ready. Dive into market intelligence."
                : "Structured intelligence for informed investing."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">

            {session ? (
              <Link href="/dashboard" className="block">
                <Button
                  className="w-full h-[54px] rounded-xl font-medium text-base shadow-lg"
                >
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                  Open Dashboard
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => signIn("google")}
                className="w-full h-[54px] rounded-xl font-medium text-base shadow-lg flex items-center justify-center gap-3"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84C.87-2.6 3.47 12 5.38 12z"
                  />
                </svg>
                Sign in with Google
              </Button>
            )}

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
            </div>

            <Link href="/dashboard" className="block">
              <Button
                variant="outline"
                className="w-full h-[54px] rounded-xl text-base font-medium border-white/10 hover:bg-white/[0.03] transition-all"
              >
                Continue as Guest
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </CardContent>

          <CardFooter className="flex flex-col items-center pt-6">
            <p className="text-[11px] text-muted-foreground/60 text-center leading-relaxed tracking-wide">
              Secure authentication powered by{" "}
              <span className="text-primary font-medium">
                Market Healers
              </span>
            </p>
          </CardFooter>
        </Card>
      </div>

      <Footer />
    </div>
  )
}