const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Deploying Chain A Contracts...");
  const SourceToken = await hre.ethers.getContractFactory("SourceToken");
  const sourceToken = await SourceToken.deploy();
  await sourceToken.waitForDeployment();

  const LockContract = await hre.ethers.getContractFactory("LockContract");
  const lockContract = await LockContract.deploy(sourceToken.target);
  await lockContract.waitForDeployment();

  console.log(`SourceToken deployed to: ${sourceToken.target}`);
  console.log(`LockContract deployed to: ${lockContract.target}`);

  fs.writeFileSync("chainA_addresses.json", JSON.stringify({
    sourceToken: sourceToken.target,
    lockContract: lockContract.target
  }));
}
main().catch((error) => { console.error(error); process.exitCode = 1; });