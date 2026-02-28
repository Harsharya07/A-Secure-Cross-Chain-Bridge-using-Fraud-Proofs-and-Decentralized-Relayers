// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LockContract {
    IERC20 public sourceToken;
    uint256 public currentNonce;

    event Locked(address indexed user, uint256 amount, uint256 nonce);

    constructor(address _tokenAddress) {
        sourceToken = IERC20(_tokenAddress);
    }

    function lockTokens(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(sourceToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        currentNonce++;
        emit Locked(msg.sender, amount, currentNonce);
    }
}