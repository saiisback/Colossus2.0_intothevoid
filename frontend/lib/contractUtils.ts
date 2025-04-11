import { ethers } from 'ethers';
import TokenVendorABI from '@/app/blockchain-tokens/TokenVendor.json';
import CarbonCreditABI from '@/app/blockchain-tokens/CarbonCredit.json';

const tokenVendorAddress = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'; // Replace with your deployed TokenVendor address
const carbonCreditAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'; // Replace with your deployed CarbonCredit address

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const getProvider = (): ethers.BrowserProvider => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }
  return new ethers.BrowserProvider(window.ethereum);
};

export const getTokenVendorContract = async (): Promise<ethers.Contract> => {
  const provider = getProvider();
  const signer = await provider.getSigner();
  return new ethers.Contract(tokenVendorAddress, TokenVendorABI.abi, signer);
};

export const getCarbonCreditContract = async (): Promise<ethers.Contract> => {
  const provider = getProvider();
  const signer = await provider.getSigner();
  return new ethers.Contract(carbonCreditAddress, CarbonCreditABI.abi, signer);
};
