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

// Company logo mapping
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

// Format volume in Indian format (Lakhs/Crores)
const formatVolume = (volume: number) => {
  if (volume >= 10000000) {
    return `${(volume / 10000000).toFixed(1)}Cr`
  } else if (volume >= 100000) {
    return `${(volume / 100000).toFixed(1)}L`
  } else {
    return volume.toLocaleString("en-IN")
  }
}

// Get sector color
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

  return sectorColors[sector] || "bg-gray-100 text-gray-800"
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

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setSelectedConditions([...selectedConditions, condition])
    } else {
      setSelectedConditions(selectedConditions.filter((c) => c !== condition))
    }
  }

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conditions: selectedConditions,
          stock_list: selectedStockList,
          logic: logic,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

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
              if (data.type === "progress") {
                setProgress(data.progress)
              } else if (data.type === "result") {
                setResults((prev) => [...prev, data.result])
              } else if (data.type === "error") {
                setError(data.message)
              } else if (data.type === "summary") {
                setRealDataCount(data.realDataCount || 0)
                console.log("Screening completed:", data)
              }
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
  const successfulResults = results.filter((r) => r.success)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="text-blue-600">Dhaleo</span> Stock Screener
          </h1>
          <p className="text-gray-600">Real-time technical analysis and stock screening for Indian markets</p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-green-600" />
              <Badge variant="outline" className="text-xs">
                NSE Listed Companies
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-blue-600" />
              <Badge variant="outline" className="text-xs">
                Real-time Market Data
              </Badge>
            </div>
            {realDataCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-xs bg-green-600">
                  {realDataCount} Live Prices
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Screening Configuration */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Screening Setup
                </CardTitle>
                <CardDescription>Configure your screening conditions and parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stock List Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Stock Universe</label>
                  <Select value={selectedStockList} onValueChange={setSelectedStockList}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STOCK_LISTS).map(([key, name]) => (
                        <SelectItem key={key} value={key}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Logic Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Condition Logic</label>
                  <Select value={logic} onValueChange={setLogic}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="and">All conditions (AND)</SelectItem>
                      <SelectItem value="or">Any condition (OR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Screening Conditions */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Screening Conditions</label>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {Object.entries(TEMPLATES).map(([key, template]) => {
                      const Icon = template.icon
                      return (
                        <div key={key} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                          <Checkbox
                            id={key}
                            checked={selectedConditions.includes(key)}
                            onCheckedChange={(checked) => handleConditionChange(key, checked as boolean)}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-gray-500" />
                              <label htmlFor={key} className="text-sm font-medium cursor-pointer">
                                {template.name}
                              </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Run Button */}
                <Button
                  onClick={runScreening}
                  disabled={isScreening || selectedConditions.length === 0}
                  className="w-full"
                  size="lg"
                >
                  {isScreening ? (
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 animate-pulse" />
                      Fetching Live Data...
                    </div>
                  ) : (
                    "Run Real-time Screening"
                  )}
                </Button>

                {/* Progress */}
                {isScreening && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} />
                    <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                      <Wifi className="h-3 w-3 animate-pulse" />
                      Fetching real-time prices from Yahoo Finance...
                    </p>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="results" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="results">Results ({matchingResults.length})</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="space-y-4">
                {matchingResults.length === 0 && !isScreening ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Activity className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
                      <p className="text-gray-500 text-center">
                        Configure your screening conditions and click "Run Real-time Screening" to get started
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {matchingResults.map((result, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-gray-200 flex items-center justify-center">
                                <img
                                  src={getCompanyLogo(result.symbol) || "/placeholder.svg"}
                                  alt={result.company_name || result.symbol}
                                  className="w-10 h-10 object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = `https://ui-avatars.com/api/?name=${result.symbol}&background=0D8ABC&color=fff&size=40`
                                  }}
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg">{result.symbol}</h3>
                                  <Wifi className="h-3 w-3 text-green-500" title="Real-time data" />
                                </div>
                                <p className="text-sm text-gray-600">{result.company_name}</p>
                                {result.sector && (
                                  <Badge className={`text-xs mt-1 ${getSectorColor(result.sector)}`}>
                                    {result.sector}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold flex items-center gap-1">
                                <IndianRupee className="h-4 w-4" />
                                {result.current_price?.toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                              {result.latest_data?.rsi && (
                                <p className="text-sm text-gray-500">RSI: {result.latest_data.rsi.toFixed(1)}</p>
                              )}
                              {result.latest_data?.volume && (
                                <p className="text-xs text-gray-400">Vol: {formatVolume(result.latest_data.volume)}</p>
                              )}
                            </div>
                          </div>

                          {/* Signals */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {Object.entries(result.signals || {}).map(([signal, matches]) => (
                              <Badge key={signal} variant={matches ? "default" : "secondary"} className="text-xs">
                                {TEMPLATES[signal as keyof typeof TEMPLATES]?.name || signal}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="summary">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Screened</p>
                          <p className="text-2xl font-bold">{results.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Wifi className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Real-time Data</p>
                          <p className="text-2xl font-bold">{realDataCount}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Activity className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Matching</p>
                          <p className="text-2xl font-bold">{matchingResults.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Selected Conditions Summary */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Active Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedConditions.map((condition) => (
                        <Badge key={condition} variant="outline">
                          {TEMPLATES[condition as keyof typeof TEMPLATES]?.name || condition}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                      <Wifi className="h-3 w-3" />
                      Logic: {logic.toUpperCase()} • Stock List:{" "}
                      {STOCK_LISTS[selectedStockList as keyof typeof STOCK_LISTS]} • Real-time Market Data
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
