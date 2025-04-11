"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function VerificationSearchCard() {
  const [verificationId, setVerificationId] = useState("")
  const [result, setResult] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("carbon_verifications")
      .select("*")
      .eq("id", verificationId)
      .single()

    if (error) {
      console.error("Error fetching verification:", error.message)
      setResult(null)
    } else {
      setResult(data)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-2xl bg-slate-900 border border-slate-700 shadow-xl rounded-2xl">
          <CardHeader className="border-b border-slate-700">
            <CardTitle className="text-green-400 text-xl">Carbon Credit Verification</CardTitle>
            <CardDescription className="text-slate-400">
              Search using the Verification UUID
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="verificationId" className="text-slate-300">Verification ID</Label>
              <Input
                id="verificationId"
                placeholder="Enter UUID"
                value={verificationId}
                onChange={(e) => setVerificationId(e.target.value)}
                className="bg-slate-800 border border-slate-600 text-slate-200 placeholder:text-slate-500"
              />
              <Button
                onClick={handleSearch}
                className="mt-2 w-full bg-green-600 hover:bg-green-500 text-white"
                disabled={loading}
              >
                <Search className="mr-2 h-4 w-4" />
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            {result && (
              <div className="text-slate-300 space-y-2 border-t border-slate-700 pt-4">
                <p><span className="text-slate-400">Verified:</span> {result.verified ? "✅ Yes" : "❌ No"}</p>
                <p><span className="text-slate-400">Start Date:</span> {format(new Date(result.start_date), "PPP")}</p>
                <p><span className="text-slate-400">End Date:</span> {format(new Date(result.end_date), "PPP")}</p>
                <p><span className="text-slate-400">Area (ha):</span> {result.area_ha ?? "N/A"}</p>
                <p><span className="text-slate-400">Carbon Credits:</span> {result.carbon_credits ?? "N/A"}</p>
                <p><span className="text-slate-400">NDVI Start:</span> {result.ndvi_start ?? "N/A"}</p>
                <p><span className="text-slate-400">NDVI End:</span> {result.ndvi_end ?? "N/A"}</p>
                <p><span className="text-slate-400">NDVI Change:</span> {result.ndvi_change ?? "N/A"}</p>
                <p><span className="text-slate-400">Timestamp:</span> {format(new Date(result.timestamp), "PPP p")}</p>
                <p>
                  <span className="text-slate-400">Coordinates:</span>
                  <pre className="bg-slate-800 text-xs text-slate-300 p-2 mt-1 rounded overflow-x-auto">
                    {JSON.stringify(result.coordinates, null, 2)}
                  </pre>
                </p>
              </div>
            )}

            {!loading && verificationId && !result && (
              <p className="text-red-500 text-sm">No record found for this ID.</p>
            )}
          </CardContent>

          <CardFooter className="border-t border-slate-700 pt-6" />
        </Card>
      </main>
    </div>
  )
}