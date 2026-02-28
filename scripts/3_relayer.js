const { ethers } = require("ethers");
const fs = require("fs");

async function main() {
  const chainA_RPC = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const chainB_RPC = new ethers.JsonRpcProvider("http://127.0.0.1:9545");

  // Private key of Hardhat Account #2 (Relayer)
  const relayerKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"; 
  const relayerWalletA = new ethers.Wallet(relayerKey, chainA_RPC);
  const relayerWalletB = new ethers.Wallet(relayerKey, chainB_RPC);

  const chainA = JSON.parse(fs.readFileSync("chainA_addresses.json"));
  const chainB = JSON.parse(fs.readFileSync("chainB_addresses.json"));

  // Contract Instances
  const lockABI = ["event Locked(address indexed user, uint256 amount, uint256 nonce)"];
  const bridgeABI = ["function submitClaim(address,uint256,uint256)", "function finalizeClaim(uint256)"];
  const stakeABI = ["function stake() payable"];

  const lockContract = new ethers.Contract(chainA.lockContract, lockABI, relayerWalletA);
  const bridgeContract = new ethers.Contract(chainB.bridgeContract, bridgeABI, relayerWalletB);
  const stakingContract = new ethers.Contract(chainB.stakingContract, stakeABI, relayerWalletB);

  console.log("Relayer booting up...");
  console.log("1. Staking 1 ETH on Chain B to become authorized...");
  try {
      const tx = await stakingContract.stake({ value: ethers.parseEther("1.0") });
      await tx.wait();
      console.log("✅ Staked successfully!");
  } catch(e) { console.log("Already staked or error."); }

  console.log("2. Listening for Lock events on Chain A...");

  lockContract.on("Locked", async (user, amount, nonce) => {
    console.log(`\n🔔 [EVENT] Detected Lock on Chain A! User: ${user}, Amount: ${amount}, Nonce: ${nonce}`);
    
    try {
        console.log(`   -> Submitting Claim to Chain B Bridge...`);
        const txSubmit = await bridgeContract.submitClaim(user, amount, nonce);
        await txSubmit.wait();
        console.log(`   ✅ Claim Submitted. Challenge window (10s) started!`);

        // Wait for challenge period
        console.log(`   ⏳ Waiting 12 seconds to ensure challenge window passes...`);
        setTimeout(async () => {
            console.log(`   -> Attempting to Finalize Claim ${nonce}...`);
            try {
                const txFinal = await bridgeContract.finalizeClaim(nonce);
                await txFinal.wait();
                console.log(`   🎉 Claim Finalized! Tokens minted to user on Chain B.\n`);
            } catch (err) {
                console.log(`   ❌ Finalization Failed. Was it challenged?`);
            }
        }, 12000); // 12 seconds
        
    } catch (err) {
        console.error("Error submitting claim:", err.message);
    }
  });
}
main();