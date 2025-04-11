"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

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
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
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
    } catch (e) {
      setParseError(true)
      setLoading(false)
      return
    }

    try {
      const response = await fetch("http://192.168.166.174:6969/verify_and_visualize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: parsedCoordinates,
          start_date: format(startDate, "yyyy-MM-dd"),
          end_date: format(endDate, "yyyy-MM-dd"),
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setResult({ verified: false, error: "Server error occurred." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-900 p-6 rounded-xl">
      <Card className="w-full max-w-2xl mx-auto bg-slate-800 border-slate-700 shadow-lg">
        <CardHeader className="bg-slate-900 rounded-t-lg border-b border-slate-700">
          <CardTitle className="text-green-400">Carbon Credit Verification</CardTitle>
          <CardDescription className="text-slate-400">
            Submit your land coordinates and monitoring period to verify carbon credits
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 bg-slate-800 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="coordinates" className="text-slate-300">
              Coordinates (GeoJSON Polygon)
            </Label>
            <Textarea
              id="coordinates"
              value={coordinates}
              onChange={(e) => setCoordinates(e.target.value)}
              placeholder="[[[73.8567, 18.5204], [73.8570, 18.5206], [73.8572, 18.5199], [73.8567, 18.5204]]]"
              className="min-h-[100px] bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500"
            />
            {parseError && (
              <p className="text-red-400 text-sm">❌ Invalid JSON format. Please double-check the coordinates.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-slate-300">
              Start Date of Monitoring Period
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="startDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-slate-700 border-slate-600 hover:bg-slate-600",
                    !startDate && "text-slate-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="bg-slate-800 text-slate-200"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-slate-300">
              End Date of Monitoring Period
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="endDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-slate-700 border-slate-600 hover:bg-slate-600",
                    !endDate && "text-slate-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="bg-slate-800 text-slate-200"
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-900 rounded-b-lg border-t border-slate-700 flex-col gap-6">
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

          {result && (
            <div className="w-full p-4 border border-slate-700 rounded-lg space-y-3 bg-slate-800">
              <p className="text-slate-200">
                <strong>Status:</strong>{" "}
                {result.verified ? (
                  <span className="text-green-400">✅ Verified</span>
                ) : (
                  <span className="text-red-400">❌ Not Verified</span>
                )}
              </p>

              {result.reason && (
                <p className="text-slate-200">
                  <strong>Reason:</strong> {result.reason}
                </p>
              )}

              {result.carbon_credits !== undefined && (
                <p className="text-slate-200">
                  <strong>Carbon Credits:</strong> {result.carbon_credits}
                </p>
              )}

              {result.area_ha !== undefined && (
                <p className="text-slate-200">
                  <strong>Area (ha):</strong> {result.area_ha.toFixed(6)}
                </p>
              )}

              {result.ndvi_start !== undefined && (
                <p className="text-slate-200">
                  <strong>NDVI Start:</strong> {result.ndvi_start.toFixed(8)}
                </p>
              )}

              {result.ndvi_end !== undefined && (
                <p className="text-slate-200">
                  <strong>NDVI End:</strong> {result.ndvi_end.toFixed(8)}
                </p>
              )}

              {result.ndvi_change !== undefined && (
                <p className="text-slate-200">
                  <strong>NDVI Change:</strong> {result.ndvi_change.toFixed(8)}
                </p>
              )}

              {result.plot_image_base64 && (
                <div className="mt-4">
                  <p className="text-slate-300 mb-2">
                    <strong>Plot Visualization:</strong>
                  </p>
                  <img
                    src={`data:image/png;base64,${result.plot_image_base64}`}
                    alt="Plot Visualization"
                    className="rounded-lg border border-slate-600 w-full"
                  />
                </div>
              )}

              {result.error && <p className="text-red-400 font-semibold">Error: {result.error}</p>}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
