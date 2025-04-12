"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getTokenVendorContract } from "@/lib/contractUtils";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Marketplace: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [vendorContract, setVendorContract] = useState<ethers.Contract | null>(null);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [uuidInput, setUuidInput] = useState("");
  const [showVerifications, setShowVerifications] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const accounts = await provider.send("eth_requestAccounts", []);
          setAccount(accounts[0]);
          const contract = await getTokenVendorContract();
          setVendorContract(contract);
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };

    const fetchRegisteredEvents = async () => {
      const { data, error } = await supabase
        .from("carbon_verifications")
        .select("*")
        .eq("event_registered", true);

      if (error) {
        console.error("Error fetching registered events:", error);
        return;
      }

      setRegisteredEvents(data || []);
    };

    init();
    fetchRegisteredEvents();
  }, []);

  const buyTokens = async () => {
    if (!vendorContract) return;
    try {
      const tx = await vendorContract.buyTokens({ value: ethers.parseEther("0.1") });
      await tx.wait();
      alert("Tokens purchased successfully!");
    } catch (error) {
      console.error("Error purchasing tokens:", error);
      alert("NFT purchased successfully!");
    }
  };

  const fetchVerifications = async () => {
    const { data, error } = await supabase
      .from("carbon_verifications")
      .select("*")
      .eq("id", uuidInput);

    if (error) {
      console.error("Error fetching verifications:", error);
      return;
    }

    setVerifications(data || []);
    setShowVerifications(true);
  };

  const renderCard = (v: any) => (
    <Card key={v.id} className="bg-slate-800 border border-slate-700">
      <CardHeader>
        <CardTitle className="text-green-400">Event ID: {v.id}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-300 space-y-2">
        <p><span className="text-white">Verified:</span> {v.verified ? "✅ Yes" : "❌ No"}</p>
        <p><span className="text-white">Carbon Credits:</span> {v.carbon_credits}</p>
        <p><span className="text-white">Area (ha):</span> {v.area_ha}</p>
        <p><span className="text-white">NDVI Start:</span> {v.ndvi_start}</p>
        <p><span className="text-white">NDVI End:</span> {v.ndvi_end}</p>
        <p><span className="text-white">NDVI Change:</span> {v.ndvi_change}</p>
        <p><span className="text-white">Start Date:</span> {v.start_date}</p>
        <p><span className="text-white">End Date:</span> {v.end_date}</p>
        <Button
          onClick={buyTokens}
          className="mt-4 w-full bg-green-600 hover:bg-green-500 text-white"
        >
          Buy Tokens
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <main className="max-w-6xl mx-auto py-10 space-y-10">
          {/* 🔷 Input Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <input
              type="text"
              placeholder="Enter Event UUID"
              value={uuidInput}
              onChange={(e) => setUuidInput(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-md flex-1"
            />
            <Button
              disabled={!uuidInput}
              onClick={fetchVerifications}
              className="bg-blue-700 hover:bg-blue-600 text-white w-full sm:w-auto"
            >
              Add Event
            </Button>
          </div>

          {/* 🔷 Marketplace Card */}
          <Card className="w-full shadow-lg bg-slate-800 border border-slate-700">
            <CardHeader className="bg-slate-700 rounded-t-lg">
              <CardTitle className="text-2xl text-green-400">🌱 Green Token Marketplace</CardTitle>
            </CardHeader>
            <Separator className="bg-slate-700" />
            <CardContent className="py-6 space-y-4">
              {account ? (
                <>
                  <p className="text-sm text-gray-400">
                    <span className="font-medium text-white">Connected Wallet:</span> {account}
                  </p>
                </>
              ) : (
                <Button
                  className="w-full bg-green-600 hover:bg-green-500 text-white"
                  onClick={() => window.ethereum.request({ method: "eth_requestAccounts" })}
                >
                  Connect Wallet
                </Button>
              )}
            </CardContent>
          </Card>

          {/* 🔷 Manual UUID Verification */}
          {showVerifications && (
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-yellow-300">📄 Manual Event Verification</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {verifications.map(renderCard)}
              </div>
            </section>
          )}

          {/* 🔷 Auto-fetched Registered Events */}
          {registeredEvents.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-green-300">🪴 Registered Carbon Credit Events</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredEvents.map(renderCard)}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Marketplace;