// src/contractUtils.ts
import { ethers } from 'ethers';
import TokenVendorABI from "@/"; // Ensure this path is correct

const contractAddress = '0xYourDeployedTokenVendorAddress'; // Replace with your deployed contract address

export const getContract = () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, TokenVendorABI.abi, signer);
};
