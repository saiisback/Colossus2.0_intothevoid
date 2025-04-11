"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import Navbar from "@/components/navbar"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type VerificationResponse = {
  verified: boolean
  error?: string
  reason?: string
  carbon_credits?: number
  area_ha?: number
  ndvi_start?: number
  ndvi_end?: number
  ndvi_change?: number
  plot_image_base64?: string
  id?: string // <-- Added for the inserted ID
}

export default function CarbonVerificationCard() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [coordinates, setCoordinates] = useState("")
  const [result, setResult] = useState<VerificationResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [parseError, setParseError] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setParseError(false)
    setResult(null)

    if (!startDate || !endDate) {
      setResult({ verified: false, error: "Please select both start and end dates." })
      setLoading(false)
      return
    }

    let parsedCoordinates
    try {
      parsedCoordinates = JSON.parse(coordinates)
    } catch {
      setParseError(true)
      setLoading(false)
      return
    }

    try {
      const response = await fetch("http://192.168.166.174:6969/verify_and_visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coordinates: parsedCoordinates,
          start_date: startDate,
          end_date: endDate,
        }),
      })

      const data: VerificationResponse = await response.json()

      // Supabase insert
      const { data: inserted, error } = await supabase
        .from("carbon_verifications")
        .insert([
          {
            coordinates: parsedCoordinates,
            start_date: startDate,
            end_date: endDate,
            verified: data.verified,
            carbon_credits: data.carbon_credits,
            area_ha: data.area_ha,
            ndvi_start: data.ndvi_start,
            ndvi_end: data.ndvi_end,
            ndvi_change: data.ndvi_change,
          },
        ])
        .select("id")

      if (error) {
        console.error("Supabase insert error:", error)
      } else if (inserted?.length > 0) {
        data.id = inserted[0].id
      }

      setResult(data)
    } catch {
      setResult({ verified: false, error: "Server error occurred. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="bg-slate-950 min-h-screen md:px-8 py-10">
        <div className="pt-20 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 max-w-7xl mx-auto px-4">
          {/* Input Card */}
          <Card className="w-full lg:flex-1 bg-slate-800 border border-slate-700 shadow-xl">
            <CardHeader className="bg-slate-900 border-b border-slate-700 rounded-t-lg px-6 py-4">
              <CardTitle className="text-green-400 text-xl">🌱 Carbon Credit Verification</CardTitle>
              <CardDescription className="text-slate-400">
                Enter your plot coordinates and a time range to analyze vegetation changes.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Coordinates */}
              <div className="space-y-2">
                <Label htmlFor="coordinates" className="text-slate-300 font-medium">
                  Coordinates (GeoJSON Polygon)
                </Label>
                <Textarea
                  id="coordinates"
                  value={coordinates}
                  onChange={(e) => setCoordinates(e.target.value)}
                  placeholder={`e.g. [[[73.8567, 18.5204], [73.8570, 18.5206], [73.8572, 18.5199], [73.8567, 18.5204]]]`}
                  className="min-h-[100px] bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500"
                />
                {parseError && (
                  <p className="text-red-400 text-sm font-medium">⚠️ Invalid JSON format. Please ensure it's a valid GeoJSON polygon.</p>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-slate-300 font-medium">Start Date</Label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded-md px-3 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-slate-300 font-medium">End Date</Label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-900 border-t border-slate-700 px-6 py-4">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-500 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Carbon Credits"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Result Card */}
          {result && (
            <Card className="w-full lg:w-1/2 bg-slate-800 border border-slate-700 shadow-xl">
              <CardHeader className="bg-slate-900 border-b border-slate-700 rounded-t-lg px-6 py-4">
                <CardTitle className="text-green-400 text-xl">📊 Verification Result</CardTitle>
                <CardDescription className="text-slate-400">
                  System-generated analysis based on your inputs
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-slate-200">
                <p><strong>Status:</strong>{" "}
                  {result.verified ? (
                    <span className="text-green-400 font-medium">✅ Verified</span>
                  ) : (
                    <span className="text-red-400 font-medium">❌ Not Verified</span>
                  )}
                </p>
                {result.id && (
                  <p className="text-slate-400">
                    <strong>🆔 Verification ID:</strong> {result.id}
                  </p>
                )}

                {result.reason && <p><strong>Reason:</strong> {result.reason}</p>}
                {result.carbon_credits !== undefined && (
                  <p><strong>Estimated Carbon Credits:</strong> {result.carbon_credits}</p>
                )}
                {result.area_ha !== undefined && (
                  <p><strong>Plot Area (ha):</strong> {result.area_ha.toFixed(6)}</p>
                )}
                {result.ndvi_start !== undefined && (
                  <p><strong>NDVI Start:</strong> {result.ndvi_start.toFixed(8)}</p>
                )}
                {result.ndvi_end !== undefined && (
                  <p><strong>NDVI End:</strong> {result.ndvi_end.toFixed(8)}</p>
                )}
                {result.ndvi_change !== undefined && (
                  <p><strong>NDVI Change:</strong> {result.ndvi_change.toFixed(8)}</p>
                )}

                {result.plot_image_base64 && (
                  <div>
                    <p className="mb-2 font-semibold">🖼️ Plot Visualization</p>
                    <img
                      src={`data:image/png;base64,${result.plot_image_base64}`}
                      alt="NDVI Plot"
                      className="rounded-lg border border-slate-600 w-full max-h-[400px] object-contain"
                    />
                  </div>
                )}

                

                {result.error && (
                  <p className="text-red-400 font-semibold">⚠️ {result.error}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}