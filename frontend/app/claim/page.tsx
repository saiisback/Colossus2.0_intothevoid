"use client"

import { useState } from "react"
import { CalendarIcon, Upload } from "lucide-react"
import { format } from "date-fns"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function CO2ReductionClaimCard() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted")
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg bg-slate-900 border border-slate-700 shadow-xl rounded-2xl">
          <CardHeader className="border-b border-slate-700">
            <CardTitle className="text-green-400 text-xl">CO2 Reduction Claim</CardTitle>
            <CardDescription className="text-slate-400">
              Submit your carbon reduction project details
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectId" className="text-slate-300">
                  Project ID
                </Label>
                <Input
                  id="projectId"
                  placeholder="Enter project identifier"
                  required
                  className="bg-slate-800 border border-slate-600 text-slate-200 placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="co2Reduction" className="text-slate-300">
                  CO2 Reduction (tons)
                </Label>
                <Input
                  id="co2Reduction"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  className="bg-slate-800 border border-slate-600 text-slate-200 placeholder:text-slate-500"
                />
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
                        "w-full justify-start text-left font-normal bg-slate-800 border border-slate-600 hover:bg-slate-700 text-slate-200",
                        !startDate && "text-slate-500",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="bg-slate-900 text-slate-200"
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
                        "w-full justify-start text-left font-normal bg-slate-800 border border-slate-600 hover:bg-slate-700 text-slate-200",
                        !endDate && "text-slate-500",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="bg-slate-900 text-slate-200"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenceDoc" className="text-slate-300">
                  Reference Document
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="referenceDoc"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-slate-800 border border-slate-600 hover:bg-slate-700 text-slate-200"
                    onClick={() => document.getElementById("referenceDoc")?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {selectedFile ? selectedFile.name : "Upload document"}
                  </Button>
                </div>
                {selectedFile && (
                  <p className="text-sm text-slate-400 mt-1">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </form>
          </CardContent>

          <CardFooter className="border-t border-slate-700 pt-6">
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-500 text-white transition"
            >
              Claim CO2 Reduction
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
