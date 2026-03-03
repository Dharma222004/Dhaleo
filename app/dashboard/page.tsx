"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, TrendingUp, TrendingDown, Activity, BarChart3, IndianRupee, Wifi } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, Info } from "lucide-react"

interface ScreeningResult {
    symbol: string
    company_name?: string
    sector?: string
    success: boolean
    error?: string
    matches: boolean
    current_price?: number
    signals?: Record<string, boolean>
    latest_data?: {
        date: string
        volume: number
        rsi?: number
    }
}

const TEMPLATES = {
    oversold_rsi: { name: "Oversold RSI", description: "RSI < 30", icon: TrendingUp },
    overbought_rsi: { name: "Overbought RSI", description: "RSI > 70", icon: TrendingDown },
    golden_cross: { name: "Golden Cross", description: "SMA(50) > SMA(200)", icon: Activity },
    above_ema20: { name: "Above EMA20", description: "Price > EMA(20)", icon: TrendingUp },
    below_ema20: { name: "Below EMA20", description: "Price < EMA(20)", icon: TrendingDown },
    macd_bullish: { name: "MACD Bullish", description: "MACD > Signal", icon: TrendingUp },
    macd_bearish: { name: "MACD Bearish", description: "MACD < Signal", icon: TrendingDown },
    high_volume: { name: "High Volume", description: "Volume > 1.5x Average", icon: BarChart3 },
    low_volume: { name: "Low Volume", description: "Volume < 0.8x Average", icon: BarChart3 },
    momentum_up: { name: "Momentum Up", description: "Price > 5 days ago", icon: TrendingUp },
    momentum_down: { name: "Momentum Down", description: "Price < 5 days ago", icon: TrendingDown },
    breakout: { name: "Breakout", description: "Price > 20-day High", icon: Activity },
    breakdown: { name: "Breakdown", description: "Price < 20-day Low", icon: Activity },
}

const STOCK_LISTS = {
    nifty50: "Nifty 50",
    sensex30: "Sensex 30",
    banknifty: "Bank Nifty",
    it: "IT Stocks",
}

const getCompanyLogo = (symbol: string) => {
    const logoMap: Record<string, string> = {
        RELIANCE: "https://logo.clearbit.com/ril.com",
        TCS: "https://logo.clearbit.com/tcs.com",
        HDFCBANK: "https://logo.clearbit.com/hdfcbank.com",
        INFY: "https://logo.clearbit.com/infosys.com",
        ICICIBANK: "https://logo.clearbit.com/icicibank.com",
        HINDUNILVR: "https://logo.clearbit.com/unilever.com",
        SBIN: "https://logo.clearbit.com/sbi.co.in",
        BHARTIARTL: "https://logo.clearbit.com/airtel.in",
        ITC: "https://logo.clearbit.com/itcportal.com",
        KOTAKBANK: "https://logo.clearbit.com/kotak.com",
        LT: "https://logo.clearbit.com/larsentoubro.com",
        ASIANPAINT: "https://logo.clearbit.com/asianpaints.com",
        MARUTI: "https://logo.clearbit.com/marutisuzuki.com",
        AXISBANK: "https://logo.clearbit.com/axisbank.com",
        TITAN: "https://logo.clearbit.com/titan.co.in",
        SUNPHARMA: "https://logo.clearbit.com/sunpharma.com",
        ULTRACEMCO: "https://logo.clearbit.com/ultratechcement.com",
        NESTLEIND: "https://logo.clearbit.com/nestle.in",
        WIPRO: "https://logo.clearbit.com/wipro.com",
        HCLTECH: "https://logo.clearbit.com/hcltech.com",
        TECHM: "https://logo.clearbit.com/techmahindra.com",
        POWERGRID: "https://logo.clearbit.com/powergridindia.com",
        NTPC: "https://logo.clearbit.com/ntpc.co.in",
        ONGC: "https://logo.clearbit.com/ongcindia.com",
        TATAMOTORS: "https://logo.clearbit.com/tatamotors.com",
        TATASTEEL: "https://logo.clearbit.com/tatasteel.com",
        BAJFINANCE: "https://logo.clearbit.com/bajajfinserv.in",
        BAJAJFINSV: "https://logo.clearbit.com/bajajfinserv.in",
        HEROMOTOCO: "https://logo.clearbit.com/heromotocorp.com",
        BRITANNIA: "https://logo.clearbit.com/britannia.co.in",
        DRREDDY: "https://logo.clearbit.com/drreddys.com",
        EICHERMOT: "https://logo.clearbit.com/eichermotors.com",
        CIPLA: "https://logo.clearbit.com/cipla.com",
        GRASIM: "https://logo.clearbit.com/grasim.com",
        JSWSTEEL: "https://logo.clearbit.com/jsw.in",
        HINDALCO: "https://logo.clearbit.com/hindalco.com",
        INDUSINDBK: "https://logo.clearbit.com/indusind.com",
        UPL: "https://logo.clearbit.com/upl-ltd.com",
        COALINDIA: "https://logo.clearbit.com/coalindia.in",
        BPCL: "https://logo.clearbit.com/bharatpetroleum.in",
        DIVISLAB: "https://logo.clearbit.com/divis.com",
        TATACONSUM: "https://logo.clearbit.com/tatacompanies.com",
        APOLLOHOSP: "https://logo.clearbit.com/apollohospitals.com",
        ADANIPORTS: "https://logo.clearbit.com/adani.com",
        ADANIENT: "https://logo.clearbit.com/adani.com",
        TMCV: "https://logo.clearbit.com/tatamotors.com",
        ZOMATO: "https://logo.clearbit.com/zomato.com",
        BEL: "https://logo.clearbit.com/bel-india.in",
        TRENT: "https://logo.clearbit.com/trentlimited.com",
        JIOFIN: "https://logo.clearbit.com/jio.com",
        LICI: "https://logo.clearbit.com/licindia.in",
        INDIGO: "https://logo.clearbit.com/goindigo.in",
        SHRIRAMFIN: "https://logo.clearbit.com/shriramfinance.in",
        HAL: "https://logo.clearbit.com/hal-india.co.in",
    }
    return logoMap[symbol] || `https://ui-avatars.com/api/?name=${symbol}&background=0D8ABC&color=fff&size=40`
}

const formatVolume = (volume: number) => {
    if (volume >= 10000000) return `${(volume / 10000000).toFixed(1)}Cr`
    if (volume >= 100000) return `${(volume / 100000).toFixed(1)}L`
    return volume.toLocaleString("en-IN")
}

const getSectorColor = (sector: string) => {
    const sectorColors: Record<string, string> = {
        Banking: "bg-blue-100 text-blue-800",
        IT: "bg-green-100 text-green-800",
        FMCG: "bg-purple-100 text-purple-800",
        Pharma: "bg-red-100 text-red-800",
        Automobile: "bg-orange-100 text-orange-800",
        "Oil & Gas": "bg-yellow-100 text-yellow-800",
        Steel: "bg-gray-100 text-gray-800",
        Cement: "bg-stone-100 text-stone-800",
        Infrastructure: "bg-indigo-100 text-indigo-800",
        Telecom: "bg-pink-100 text-pink-800",
        Insurance: "bg-cyan-100 text-cyan-800",
        NBFC: "bg-teal-100 text-teal-800",
        "Financial Services": "bg-emerald-100 text-emerald-800",
        Healthcare: "bg-rose-100 text-rose-800",
        Jewellery: "bg-amber-100 text-amber-800",
        Chemicals: "bg-lime-100 text-lime-800",
        Mining: "bg-slate-100 text-slate-800",
        Power: "bg-violet-100 text-violet-800",
        Engineering: "bg-sky-100 text-sky-800",
        Conglomerate: "bg-neutral-100 text-neutral-800",
        Paints: "bg-fuchsia-100 text-fuchsia-800",
        Metals: "bg-zinc-100 text-zinc-800",
    }
    return sectorColors[sector] || "bg-muted text-muted-foreground"
}

export default function DhaleoScreener() {
    const [selectedConditions, setSelectedConditions] = useState<string[]>(["oversold_rsi"])
    const [selectedStockList, setSelectedStockList] = useState<string>("nifty50")
    const [logic, setLogic] = useState<string>("and")
    const [isScreening, setIsScreening] = useState(false)
    const [progress, setProgress] = useState(0)
    const [results, setResults] = useState<ScreeningResult[]>([])
    const [error, setError] = useState<string>("")
    const [realDataCount, setRealDataCount] = useState(0)

    const runScreening = async () => {
        if (selectedConditions.length === 0) {
            setError("Please select at least one screening condition")
            return
        }
        setIsScreening(true)
        setProgress(0)
        setError("")
        setResults([])
        setRealDataCount(0)
        try {
            const response = await fetch("/api/screen", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conditions: selectedConditions, stock_list: selectedStockList, logic: logic }),
            })
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            const reader = response.body?.getReader()
            if (!reader) throw new Error("No response body")
            const decoder = new TextDecoder()
            let buffer = ""
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split("\n")
                buffer = lines.pop() || ""
                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line)
                            if (data.type === "progress") setProgress(data.progress)
                            else if (data.type === "result") setResults((prev) => [...prev, data.result])
                            else if (data.type === "error") setError(data.message)
                            else if (data.type === "summary") setRealDataCount(data.realDataCount || 0)
                        } catch (e) {
                            console.error("Error parsing line:", line, e)
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Screening error:", err)
            setError(err instanceof Error ? err.message : "An error occurred during screening")
        } finally {
            setIsScreening(false)
            setProgress(100)
        }
    }

    const matchingResults = results.filter((r) => r.matches)

    return (
        <div className="min-h-screen bg-background premium-gradient bg-grid">
            <Navbar />
            <main className="container mx-auto px-4 py-8 md:px-8 max-w-7xl relative z-10">
                <section className="mb-10 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <img src="/logo.png" alt="Dhaleo Logo" className="h-16 w-16 rounded-2xl shadow-xl shadow-primary/20 mx-auto md:mx-0" />
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-foreground">
                                Market <span className="text-primary tracking-tighter">Intelligence Hub</span>
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl font-light mt-1">
                               Advanced Technical Intelligence for Indian Markets.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="dashboard-card border-none shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Activity className="h-5 w-5 text-primary" />
                                        Screener Lab
                                    </CardTitle>
                                </div>
                                <CardDescription>Define your entry/exit parameters</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Stock Universe</label>
                                    <Select value={selectedStockList} onValueChange={setSelectedStockList}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(STOCK_LISTS).map(([key, name]) => (
                                                <SelectItem key={key} value={key}>{name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold mb-3 flex items-center gap-2">Logic Engine</label>
                                    <Tabs value={logic} onValueChange={setLogic} className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="and" className="text-xs">Match All (AND)</TabsTrigger>
                                            <TabsTrigger value="or" className="text-xs">Match Any (OR)</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold mb-4 block">Signal Definitions</label>
                                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {Object.entries(TEMPLATES).map(([key, template]) => {
                                            const Icon = template.icon
                                            const isActive = selectedConditions.includes(key)
                                            return (
                                                <div key={key} className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${isActive ? "border-primary bg-primary/5 shadow-inner" : "hover:bg-muted/50 border-transparent"}`} onClick={() => {
                                                    if (isActive) setSelectedConditions(selectedConditions.filter(c => c !== key))
                                                    else setSelectedConditions([...selectedConditions, key])
                                                }}>
                                                    <div className={`mt-0.5 p-1.5 rounded-md ${isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                                                        <Icon className="h-3.5 w-3.5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}>{template.name}</span>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <Button
                                    onClick={runScreening}
                                    disabled={isScreening || selectedConditions.length === 0}
                                    className="w-full btn-premium bg-primary text-primary-foreground hover:bg-primary/95 shadow-2xl google-glow uppercase tracking-widest text-sm"
                                >
                                    {isScreening ? <Wifi className="h-5 w-5 animate-pulse mr-2" /> : <TrendingUp className="h-5 w-5 mr-2" />}
                                    {isScreening ? "Scanning Market..." : "Execute Scan"}
                                </Button>
                                {isScreening && <Progress value={progress} className="h-1" />}
                                {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-8">
                        <Tabs defaultValue="results" className="space-y-6">
                            <div className="flex items-center justify-between bg-card p-1 rounded-xl border shadow-sm">
                                <TabsList className="bg-transparent border-none">
                                    <TabsTrigger value="results" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">Results ({matchingResults.length})</TabsTrigger>
                                    <TabsTrigger value="summary" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">Analytics</TabsTrigger>
                                </TabsList>
                            </div>
                            <TabsContent value="results" className="space-y-4 pt-2">
                                {matchingResults.length === 0 && !isScreening ? (
                                    <Card className="border-dashed bg-muted/20 py-24 text-center">
                                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-xl font-bold">Ready to Screen</h3>
                                        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Configure your technical criteria and start identifying market setups.</p>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {matchingResults.map((result, index) => (
                                            <Card key={index} className="dashboard-card overflow-hidden">
                                                <div className="flex flex-col md:flex-row">
                                                    <div className="p-5 sm:p-6 flex-1 border-b md:border-b-0 md:border-r border-border flex items-center gap-4 sm:gap-6">
                                                        <img src={getCompanyLogo(result.symbol)} alt={result.symbol} className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl border border-white/10 shadow-lg bg-white/5 p-2 shrink-0" />
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h3 className="font-heading font-black text-xl sm:text-2xl tracking-tighter truncate">{result.symbol}</h3>
                                                                {result.success && <Badge className="bg-success/10 text-success border-none font-bold uppercase text-[9px] sm:text-[10px]">Verified</Badge>}
                                                            </div>
                                                            <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1 truncate">{result.company_name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-5 sm:p-6 md:w-64 bg-white/[0.02] flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end text-right">
                                                        <p className="text-[9px] sm:text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none md:mb-2">Market Price</p>
                                                        <p className="text-2xl sm:text-3xl font-black text-primary">₹{result.current_price?.toLocaleString("en-IN")}</p>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
