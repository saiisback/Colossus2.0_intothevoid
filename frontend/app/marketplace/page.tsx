"use client";
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getTokenVendorContract } from '@/lib/contractUtils';
import Navbar from '@/components/navbar';

const Marketplace: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [vendorContract, setVendorContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const accounts = await provider.send('eth_requestAccounts', []);
          setAccount(accounts[0]);
          const contract = await getTokenVendorContract();
          setVendorContract(contract);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        alert('Please install MetaMask!');
      }
    };
    init();
  }, []);

  const buyTokens = async () => {
    if (!vendorContract) return;
    try {
      const tx = await vendorContract.buyTokens({ value: ethers.parseEther('0.1') }); // Adjust the value as needed
      await tx.wait();
      alert('Tokens purchased successfully!');
    } catch (error) {
      console.error('Error purchasing tokens:', error);
    }
  };

  return (
    <>
    <Navbar />
    
    <div className='pt-15'>
      
      <h1>Marketplace</h1>
      {account ? (
        <div>
          <p>Connected Account: {account}</p>
          <button onClick={buyTokens}>Buy Tokens</button>
        </div>
      ) : (
        <button onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}>
          Connect Wallet
        </button>
      )}
    </div></>
    
  );
};

export default Marketplace;
