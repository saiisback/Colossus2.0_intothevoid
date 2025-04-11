"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

type VerificationResponse = {
  verified: boolean;
  error?: string;
  reason?: string;
  carbon_credits?: number;
  area_ha?: number;
  ndvi_start?: number;
  ndvi_end?: number;
  ndvi_change?: number;
  plot_image_base64?: string;
};

export default function RegisterPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [coordinates, setCoordinates] = useState("");
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://192.168.166.174:6969/verify_and_visualize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates,
          start_date: startDate?.toISOString().split("T")[0],
          end_date: endDate?.toISOString().split("T")[0],
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ verified: false, error: "Server error occurred." });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Carbon Credit Verification</h1>

      <div className="space-y-2">
        <Label htmlFor="coordinates">Coordinates (GeoJSON or Polygon)</Label>
        <Textarea
          id="coordinates"
          value={coordinates}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCoordinates(e.target.value)}
          placeholder="Enter coordinates here"
        />
      </div>

      <div className="space-y-2">
        <Label>Start Date</Label>
        <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
        {startDate && (
          <p className="text-sm text-muted-foreground">
            Selected: {format(startDate, "yyyy-MM-dd")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>End Date</Label>
        <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
        {endDate && (
          <p className="text-sm text-muted-foreground">
            Selected: {format(endDate, "yyyy-MM-dd")}
          </p>
        )}
      </div>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Verifying..." : "Submit"}
      </Button>

      {result && (
        <div className="mt-6 p-4 border rounded-lg space-y-2 bg-muted">
          <p><strong>Status:</strong> {result.verified ? "✅ Verified" : "❌ Not Verified"}</p>
          {result.reason && <p><strong>Reason:</strong> {result.reason}</p>}
          {result.carbon_credits !== undefined && <p><strong>Carbon Credits:</strong> {result.carbon_credits}</p>}
          {result.area_ha !== undefined && <p><strong>Area (ha):</strong> {result.area_ha}</p>}
          {result.ndvi_start !== undefined && <p><strong>NDVI Start:</strong> {result.ndvi_start}</p>}
          {result.ndvi_end !== undefined && <p><strong>NDVI End:</strong> {result.ndvi_end}</p>}
          {result.ndvi_change !== undefined && <p><strong>NDVI Change:</strong> {result.ndvi_change}</p>}
          {result.plot_image_base64 && (
            <img
              src={`data:image/png;base64,${result.plot_image_base64}`}
              alt="Plot Visualization"
              className="rounded-lg mt-2 border"
            />
          )}
          {result.error && (
            <p className="text-red-500 font-semibold">Error: {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}