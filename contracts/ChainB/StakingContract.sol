// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingContract is Ownable {
    mapping(address => uint256) public stakes;

    event Staked(address indexed relayer, uint256 amount);
    event Slashed(address indexed relayer, uint256 amount);

    function stake() external payable {
        require(msg.value > 0, "Must send ETH to stake");
        stakes[msg.sender] += msg.value;
        emit Staked(msg.sender, msg.value);
    }

    // Only the Bridge (which will be set as owner) can slash
    function slash(address relayer) external onlyOwner {
        uint256 amount = stakes[relayer];
        require(amount > 0, "No stake to slash");
        
        stakes[relayer] = 0;
        payable(owner()).transfer(amount); // Send slashed funds to bridge/treasury
        emit Slashed(relayer, amount);
    }
}