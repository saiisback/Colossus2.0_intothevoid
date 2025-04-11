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

      const data = await response.json()
      setResult(data)
    } catch {
      setResult({ verified: false, error: "Server error occurred." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      
      <div className="mt-15 bg-slate-950 md:px-8 py-6">
        <div className="pt-20 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 max-w-7xl mx-auto px-4">
          {/* Input Card */}
          <Card className="w-full lg:flex-1 bg-slate-800 border border-slate-700 shadow-xl">
            <CardHeader className="bg-slate-900 border-b border-slate-700 rounded-t-lg px-6 py-4">
              <CardTitle className="text-green-400">Carbon Credit Verification</CardTitle>
              <CardDescription className="text-slate-400">
                Provide coordinates and time period to validate carbon sequestration.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="coordinates" className="text-slate-300">Coordinates (GeoJSON Polygon)</Label>
                <Textarea
                  id="coordinates"
                  value={coordinates}
                  onChange={(e) => setCoordinates(e.target.value)}
                  placeholder='[[[73.8567, 18.5204], [73.8570, 18.5206], [73.8572, 18.5199], [73.8567, 18.5204]]]'
                  className="min-h-[100px] bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500"
                />
                {parseError && <p className="text-red-400 text-sm">❌ Invalid JSON format.</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-slate-300">Start Date</Label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded-md px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-slate-300">End Date</Label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded-md px-3 py-2"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-slate-900 border-t border-slate-700 px-6 py-4">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-600 text-white"
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
                <CardTitle className="text-green-400">Verification Result</CardTitle>
                <CardDescription className="text-slate-400">
                  System-generated insights and validation status
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-slate-200">
                <p><strong>Status:</strong>{" "}
                  {result.verified ? (
                    <span className="text-green-400">✅ Verified</span>
                  ) : (
                    <span className="text-red-400">❌ Not Verified</span>
                  )}
                </p>

                {result.reason && <p><strong>Reason:</strong> {result.reason}</p>}
                {result.carbon_credits !== undefined && (
                  <p><strong>Carbon Credits:</strong> {result.carbon_credits}</p>
                )}
                {result.area_ha !== undefined && (
                  <p><strong>Area (ha):</strong> {result.area_ha.toFixed(6)}</p>
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
                    <p className="mb-2"><strong>Plot Visualization:</strong></p>
                    <img
                      src={`data:image/png;base64,${result.plot_image_base64}`}
                      alt="Plot"
                      className="rounded-lg border border-slate-600 w-full max-h-[400px] object-contain"
                    />
                  </div>
                )}

                {result.error && (
                  <p className="text-red-400 font-semibold">Error: {result.error}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}