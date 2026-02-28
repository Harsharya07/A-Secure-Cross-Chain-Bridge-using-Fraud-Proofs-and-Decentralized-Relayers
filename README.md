🔐 **A Secure Cross-Chain Bridge using Fraud Proofs & Decentralized Relayers**

A hardened cross-chain bridge prototype built using Hardhat that demonstrates:

1. Secure asset locking on Source Chain (Chain A)

2. Token minting on Destination Chain (Chain B)

3. Fraud detection mechanism

4. Decentralized relayer simulation

5. Fraud watcher protection

This project simulates two local blockchains and demonstrates both:

1. ✅ Normal Cross-Chain Transfer

2. ❌ Fraud Attempt Detection

🛠 Tech Stack: 

1. Hardhat

2. Solidity

3. Node.js

4. Ethers.js

Local Hardhat Networks (Dual Chain Setup)

📦 Installation
1️⃣ Clone the Repository : git clone https://github.com/Harsharya07/A-Secure-Cross-Chain-Bridge-using-Fraud-Proofs-and-Decentralized-Relayers.git

 cd A-Secure-Cross-Chain-Bridge-using-Fraud-Proofs-and-Decentralized-Relayers

2️⃣ Install Dependencies : npm install

🚀 How to Run the Project : 
You need 4 separate terminals open.

🖥 Terminal 1 – Compile & Start Chain A
Compile Smart Contracts :  npx hardhat compile

Start Source Chain (Chain A) : npx hardhat node --port 8545

🖥 Terminal 2 – Start Chain B
Start Destination Chain : npx hardhat node --port 9545

🖥 Terminal 3 – Deploy Contracts & Start Relayer
Deploy to Chain A : npx hardhat run scripts/1_deploy_ChainA.js --network chainA
Deploy to Chain B : npx hardhat run scripts/2_deploy_ChainB.js --network chainB
Start the Relayer Bot :  node scripts/3_relayer.js
The relayer listens for lock events on Chain A and submits proofs to Chain B.

🖥 Terminal 4 – Run the Demos (Main Actions)
✅ Demo 1: Normal Transfer (Lock → Mint)

Simulates a legitimate cross-chain transfer : node scripts/4_demo_user_lock.js
Expected Flow: 
1. Tokens locked on Chain A
2. Relayer detects event
3. Tokens minted on Chain B

❌ Demo 2: Fraud Attempt

Simulates a malicious relayer or fake proof attempt : node scripts/5_demo_fraud_watcher.js

Expected Flow:
1. Fraud proof submitted
2. Fraud watcher detects inconsistency
3. Malicious action rejected

📂 Project Structure :

contracts/
scripts/
  ├── 1_deploy_ChainA.js
  ├── 2_deploy_ChainB.js
  ├── 3_relayer.js
  ├── 4_demo_user_lock.js
  ├── 5_demo_fraud_watcher.js
hardhat.config.js

🔐 Security Features : 

1. Event-based cross-chain communication
2. Fraud-proof validation logic
3. Relayer simulation
4. Fraud watcher protection layer
5. Dual independent blockchain simulation

🧠 How It Works : 

1. User locks tokens on Chain A.
2. Event is emitted.
3. Relayer listens and submits proof to Chain B.
4. Chain B verifies proof.
5. Tokens are minted.
6. If fraud detected → transaction reverted.

🛑 Important Notes : 

1. Always start both chains before deployment.
2. Relayer must be running before executing demos.
3. Use separate terminals for each process.
4. Make sure ports 8545 and 9545 are free.

🎯 Educational Purpose

This project demonstrates how hardened cross-chain bridges can defend against:

1. Fake proofs
2. Malicious relayers
3. Replay attacks
4. Event tampering

