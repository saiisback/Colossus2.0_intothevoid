"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getTokenVendorContract } from "@/lib/contractUtils";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Marketplace: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [vendorContract, setVendorContract] = useState<ethers.Contract | null>(null);

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
    init();
  }, []);

  const buyTokens = async () => {
    if (!vendorContract) return;
    try {
      const tx = await vendorContract.buyTokens({ value: ethers.parseEther("0.1") });
      await tx.wait();
      alert("Tokens purchased successfully!");
    } catch (error) {
      console.error("Error purchasing tokens:", error);
    }
  };

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 py-10">
        <Card className="max-w-xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-green-700">🌱 Green Token Marketplace</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-6 py-6">
            {account ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Connected Wallet:</span> {account}
                </p>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  0.1 ETH per Token
                </Badge>
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={buyTokens}>
                  Buy Tokens
                </Button>
              </div>
            ) : (
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => window.ethereum.request({ method: "eth_requestAccounts" })}
              >
                Connect Wallet
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default Marketplace;
