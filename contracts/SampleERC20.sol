// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FractionsContract is ERC20, Ownable {

    uint256 public DragonId;  //indicates the tokenId whose fraction this contract represent

    constructor(uint256 token) ERC20("DragonFractions", "DF") {
        DragonId = token;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
