const { ethers } = require("hardhat");
const { parseEther } = require("ethers");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
  const supply = parseEther("1000000"); // 1 million tokens

  const contract = await CarbonCredit.deploy(supply);
  await contract.waitForDeployment(); // Wait for deployment

  const deployedAddress = await contract.getAddress(); // ✅ Correct way in v6
  console.log("CarbonCredit deployed to:", deployedAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
