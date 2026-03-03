import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto, Inter_Tight, Outfit, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
})

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Dhaleo | Professional Stock Screener",
  description: "Advanced technical analysis and stock screening platform for modern investors.",
  generator: 'v0.dev'
}

import { AuthProvider } from "@/components/auth-provider"
import { RuzhaaBadge } from "@/components/ruzhaa-badge"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} ${interTight.variable} ${outfit.variable} ${plusJakarta.variable}`}>
      <body className="antialiased font-body relative">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
