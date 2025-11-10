// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Factory = await hre.ethers.getContractFactory("OlaPrimeiroContrato");
  const contrato = await Factory.deploy();
  await contrato.deployed();

  console.log("OlaPrimeiroContrato deployed to:", contrato.address);
  console.log("Dono (owner):", await contrato.dono());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
