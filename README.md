🔐 A Secure Cross-Chain Bridge using Fraud Proofs & Decentralized Relayers

A hardened cross-chain bridge prototype built using Hardhat that demonstrates:

Secure asset locking on Source Chain (Chain A)

Token minting on Destination Chain (Chain B)

Fraud detection mechanism

Decentralized relayer simulation

Fraud watcher protection

This project simulates two local blockchains and demonstrates both:

✅ Normal Cross-Chain Transfer

❌ Fraud Attempt Detection

🛠 Tech Stack

Hardhat

Solidity

Node.js

Ethers.js

Local Hardhat Networks (Dual Chain Setup)

📦 Installation
1️⃣ Clone the Repository
git clone https://github.com/Harsharya07/A-Secure-Cross-Chain-Bridge-using-Fraud-Proofs-and-Decentralized-Relayers.git
cd A-Secure-Cross-Chain-Bridge-using-Fraud-Proofs-and-Decentralized-Relayers

2️⃣ Install Dependencies
npm install

🚀 How to Run the Project

You need 4 separate terminals open.

🖥 Terminal 1 – Compile & Start Chain A
Compile Smart Contracts
npx hardhat compile

Start Source Chain (Chain A)
npx hardhat node --port 8545

🖥 Terminal 2 – Start Chain B
Start Destination Chain
npx hardhat node --port 9545

🖥 Terminal 3 – Deploy Contracts & Start Relayer
Deploy to Chain A
npx hardhat run scripts/1_deploy_ChainA.js --network chainA

Deploy to Chain B
npx hardhat run scripts/2_deploy_ChainB.js --network chainB

Start the Relayer Bot
node scripts/3_relayer.js


The relayer listens for lock events on Chain A and submits proofs to Chain B.

🖥 Terminal 4 – Run the Demos (Main Actions)
✅ Demo 1: Normal Transfer (Lock → Mint)

Simulates a legitimate cross-chain transfer.

node scripts/4_demo_user_lock.js


Expected Flow:

Tokens locked on Chain A

Relayer detects event

Tokens minted on Chain B

❌ Demo 2: Fraud Attempt

Simulates a malicious relayer or fake proof attempt.

node scripts/5_demo_fraud_watcher.js


Expected Flow:

Fraud proof submitted

Fraud watcher detects inconsistency

Malicious action rejected

📂 Project Structure
contracts/
scripts/
  ├── 1_deploy_ChainA.js
  ├── 2_deploy_ChainB.js
  ├── 3_relayer.js
  ├── 4_demo_user_lock.js
  ├── 5_demo_fraud_watcher.js
hardhat.config.js

🔐 Security Features

Event-based cross-chain communication

Fraud-proof validation logic

Relayer simulation

Fraud watcher protection layer

Dual independent blockchain simulation

🧠 How It Works

User locks tokens on Chain A.

Event is emitted.

Relayer listens and submits proof to Chain B.

Chain B verifies proof.

Tokens are minted.

If fraud detected → transaction reverted.

🛑 Important Notes

Always start both chains before deployment.

Relayer must be running before executing demos.

Use separate terminals for each process.

Make sure ports 8545 and 9545 are free.

🎯 Educational Purpose

This project demonstrates how hardened cross-chain bridges can defend against:

Fake proofs

Malicious relayers

Replay attacks

Event tampering
