// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DestToken.sol";
import "./StakingContract.sol";

contract BridgeContract {
    DestToken public destToken;
    StakingContract public stakingContract;
    
    address public watcherAdmin;
    uint256 public challengePeriod; // in seconds
    uint256 public minStake = 1 ether;

    struct Claim {
        address user;
        uint256 amount;
        address relayer;
        uint256 timestamp;
        bool isFinalized;
        bool exists;
    }

    mapping(uint256 => Claim) public claims;
    mapping(uint256 => bool) public processedNonces;

    event ClaimSubmitted(uint256 indexed nonce, address user, uint256 amount, address relayer);
    event ClaimFinalized(uint256 indexed nonce, address user, uint256 amount);
    event FraudDetected(uint256 indexed nonce, address badRelayer);

    constructor(address _destToken, address _stakingContract, uint256 _challengePeriod) {
        destToken = DestToken(_destToken);
        stakingContract = StakingContract(_stakingContract);
        watcherAdmin = msg.sender;
        challengePeriod = _challengePeriod;
    }

    function submitClaim(address user, uint256 amount, uint256 nonce) external {
        require(stakingContract.stakes(msg.sender) >= minStake, "Relayer not staked");
        require(!processedNonces[nonce], "Nonce already processed");
        require(!claims[nonce].exists, "Claim already pending");

        claims[nonce] = Claim(user, amount, msg.sender, block.timestamp, false, true);
        emit ClaimSubmitted(nonce, user, amount, msg.sender);
    }

    function finalizeClaim(uint256 nonce) external {
        require(claims[nonce].exists, "Claim does not exist");
        require(!claims[nonce].isFinalized, "Already finalized");
        require(block.timestamp >= claims[nonce].timestamp + challengePeriod, "Challenge period active");

        claims[nonce].isFinalized = true;
        processedNonces[nonce] = true;

        destToken.mint(claims[nonce].user, claims[nonce].amount);
        emit ClaimFinalized(nonce, claims[nonce].user, claims[nonce].amount);
    }

    // For academic prototype: an admin/watcher can challenge fraud
    function challengeFraud(uint256 nonce) external {
        require(msg.sender == watcherAdmin, "Only watcher can challenge");
        require(claims[nonce].exists, "Claim does not exist");
        require(!claims[nonce].isFinalized, "Already finalized");
        require(block.timestamp <= claims[nonce].timestamp + challengePeriod, "Challenge period over");

        address badRelayer = claims[nonce].relayer;
        stakingContract.slash(badRelayer);

        delete claims[nonce];
        emit FraudDetected(nonce, badRelayer);
    }
}