const { ethers } = require("ethers");
const fs = require("fs");

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  // Hardhat Account #1 (User)
  const userKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const userWallet = new ethers.Wallet(userKey, provider);

  const chainA = JSON.parse(fs.readFileSync("chainA_addresses.json"));
  
  const tokenABI = ["function approve(address,uint256)"];
  const lockABI = ["function lockTokens(uint256)"];

  const token = new ethers.Contract(chainA.sourceToken, tokenABI, userWallet);
  const lock = new ethers.Contract(chainA.lockContract, lockABI, userWallet);

  const amount = ethers.parseUnits("500", 18);

  console.log("User: Approving tokens...");
  await (await token.approve(chainA.lockContract, amount)).wait();

  console.log(`User: Locking ${ethers.formatUnits(amount, 18)} tokens...`);
  await (await lock.lockTokens(amount)).wait();
  console.log("✅ Lock transaction complete!");
}
main();