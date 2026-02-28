const { ethers } = require("ethers");
const fs = require("fs");

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:9545"); // Chain B
  
  // Hardhat Account #3 (Malicious Relayer submitting fake claim)
  const maliciousRelayerKey = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";
  // Hardhat Account #0 (Deployer/Admin Watcher)
  const adminKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  const malWallet = new ethers.Wallet(maliciousRelayerKey, provider);
  const adminWallet = new ethers.Wallet(adminKey, provider);

  const chainB = JSON.parse(fs.readFileSync("chainB_addresses.json"));
  
  const bridgeABI = ["function submitClaim(address,uint256,uint256)", "function challengeFraud(uint256)"];
  const stakeABI = ["function stake() payable"];

  const bridgeMal = new ethers.Contract(chainB.bridgeContract, bridgeABI, malWallet);
  const stakeMal = new ethers.Contract(chainB.stakingContract, stakeABI, malWallet);
  const bridgeAdmin = new ethers.Contract(chainB.bridgeContract, bridgeABI, adminWallet);

  console.log("😈 Malicious Relayer staking 1 ETH...");
  await (await stakeMal.stake({ value: ethers.parseEther("1.0") })).wait();

  const fakeNonce = 999;
  console.log(`😈 Malicious Relayer submitting FAKE claim (Nonce ${fakeNonce})...`);
  await (await bridgeMal.submitClaim(malWallet.address, ethers.parseUnits("1000", 18), fakeNonce)).wait();

  console.log("👮 Watcher detected fake claim! Challenging...");
  const tx = await bridgeAdmin.challengeFraud(fakeNonce);
  await tx.wait();
  
  console.log("✅ FRAUD CHALLENGED! Malicious Relayer's stake slashed.");
}
main();