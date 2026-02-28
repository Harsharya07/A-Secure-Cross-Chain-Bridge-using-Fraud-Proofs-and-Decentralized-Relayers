const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Cross-Chain Bridge", function () {
  let sourceToken, lockContract, destToken, stakingContract, bridgeContract;
  let owner, user, relayer;

  beforeEach(async function () {
    [owner, user, relayer] = await ethers.getSigners();

    const SourceToken = await ethers.getContractFactory("SourceToken");
    sourceToken = await SourceToken.deploy();

    const LockContract = await ethers.getContractFactory("LockContract");
    lockContract = await LockContract.deploy(sourceToken.target);

    const DestToken = await ethers.getContractFactory("DestToken");
    destToken = await DestToken.deploy();

    const StakingContract = await ethers.getContractFactory("StakingContract");
    stakingContract = await StakingContract.deploy();

    const BridgeContract = await ethers.getContractFactory("BridgeContract");
    // 2 second challenge window for fast testing
    bridgeContract = await BridgeContract.deploy(destToken.target, stakingContract.target, 2);

    await destToken.transferOwnership(bridgeContract.target);
    await stakingContract.transferOwnership(bridgeContract.target);
    
    await sourceToken.transfer(user.address, ethers.parseUnits("1000", 18));
  });

  it("Should prevent claim if relayer is not staked", async function () {
    await expect(
        bridgeContract.connect(relayer).submitClaim(user.address, 100, 1)
    ).to.be.revertedWith("Relayer not staked");
  });

  it("Should slash relayer on fraud detection", async function () {
    await stakingContract.connect(relayer).stake({ value: ethers.parseEther("1.0") });
    await bridgeContract.connect(relayer).submitClaim(user.address, 100, 1);
    
    await bridgeContract.connect(owner).challengeFraud(1);
    
    expect(await stakingContract.stakes(relayer.address)).to.equal(0);
  });
});