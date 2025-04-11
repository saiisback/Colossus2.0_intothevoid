import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

export default function CarbonVerificationPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const coords = JSON.parse(coordinates);
      const res = await fetch("http://192.168.166.174:6969/verify_and_visualize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ start_date: startDate, end_date: endDate, coordinates: coords }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card className="p-4 shadow-xl rounded-2xl">
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="start">Start Date</Label>
            <Input id="start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="end">End Date</Label>
            <Input id="end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="coords">Coordinates (GeoJSON Polygon Array)</Label>
            <Textarea
              id="coords"
              rows={5}
              placeholder='[[[77.591,12.971],[77.594,12.971],[77.594,12.973],[77.591,12.973],[77.591,12.971]]]' 
              value={coordinates}
              onChange={(e) => setCoordinates(e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Verifying..." : "Verify and Visualize"}
          </Button>
        </CardContent>
      </Card>

      {result && !result.error && (
        <Card className="p-4 mt-6 shadow-xl rounded-2xl">
          <CardContent className="space-y-4">
            <h2 className="text-xl font-bold">Verification Result</h2>
            <p><strong>Verified:</strong> {result.verified ? "Yes" : "No"}</p>
            <p><strong>Carbon Credits:</strong> {result.carbon_credits}</p>
            <p><strong>Area (ha):</strong> {result.area_ha.toFixed(2)}</p>
            <p><strong>NDVI Start:</strong> {result.ndvi_start.toFixed(3)}</p>
            <p><strong>NDVI End:</strong> {result.ndvi_end.toFixed(3)}</p>
            <p><strong>NDVI Change:</strong> {result.ndvi_change.toFixed(3)}</p>
            {result.reason && <p className="text-red-500"><strong>Reason:</strong> {result.reason}</p>}

            <div className="w-full">
              <Image 
                src={`data:image/png;base64,${result.plot_image_base64}`} 
                alt="Vegetation Indices Graph" 
                width={600} 
                height={300}
                className="rounded-xl border shadow-md mt-4"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {result && result.error && (
        <p className="text-red-600 font-semibold">Error: {result.error}</p>
      )}
    </div>
  );
}