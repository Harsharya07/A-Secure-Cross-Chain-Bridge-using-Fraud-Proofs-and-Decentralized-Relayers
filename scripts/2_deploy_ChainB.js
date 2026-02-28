const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Deploying Chain B Contracts...");
  const DestToken = await hre.ethers.getContractFactory("DestToken");
  const destToken = await DestToken.deploy();
  await destToken.waitForDeployment();

  const StakingContract = await hre.ethers.getContractFactory("StakingContract");
  const stakingContract = await StakingContract.deploy();
  await stakingContract.waitForDeployment();

  // Challenge period: 10 seconds for live demo visibility
  const BridgeContract = await hre.ethers.getContractFactory("BridgeContract");
  const bridgeContract = await BridgeContract.deploy(destToken.target, stakingContract.target, 10);
  await bridgeContract.waitForDeployment();

  // Setup permissions
  await destToken.transferOwnership(bridgeContract.target);
  await stakingContract.transferOwnership(bridgeContract.target);

  console.log(`DestToken deployed to: ${destToken.target}`);
  console.log(`StakingContract deployed to: ${stakingContract.target}`);
  console.log(`BridgeContract deployed to: ${bridgeContract.target}`);

  fs.writeFileSync("chainB_addresses.json", JSON.stringify({
    destToken: destToken.target,
    stakingContract: stakingContract.target,
    bridgeContract: bridgeContract.target
  }));
}
main().catch((error) => { console.error(error); process.exitCode = 1; });