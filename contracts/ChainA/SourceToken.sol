// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SourceToken is ERC20 {
    constructor() ERC20("Source Chain Token", "SCT") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}