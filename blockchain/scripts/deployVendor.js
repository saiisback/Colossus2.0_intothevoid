const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Replace with your actual deployed CarbonCredit token address
  const carbonCreditTokenAddress = " 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9".trim();

  // Ensure the address is correctly formatted (no ENS resolution error)
  const tokenAddress = ethers.getAddress(carbonCreditTokenAddress);

  const Vendor = await ethers.getContractFactory("TokenVendor");
  const vendorContract = await Vendor.deploy(tokenAddress);

  await vendorContract.waitForDeployment();

  const vendorAddress = await vendorContract.getAddress();
  console.log("✅ TokenVendor deployed to:", vendorAddress);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
