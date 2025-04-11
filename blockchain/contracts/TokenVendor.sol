// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenVendor {
    IERC20 public carbonCreditToken;
    address public owner;
    uint256 public tokenPrice = 0.001 ether; // Example price: 1 token = 0.001 ETH

    constructor(address tokenAddress) {
        carbonCreditToken = IERC20(tokenAddress);
        owner = msg.sender;
    }

    // Buy tokens by sending ETH
    function buyTokens() external payable {
        require(msg.value > 0, "Send ETH to buy tokens");
        uint256 amountToBuy = msg.value / tokenPrice;
        uint256 vendorBalance = carbonCreditToken.balanceOf(address(this));
        require(vendorBalance >= amountToBuy, "Vendor has insufficient tokens");

        carbonCreditToken.transfer(msg.sender, amountToBuy);
    }

    // Sell tokens back to the contract
    function sellTokens(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Specify token amount to sell");
        uint256 etherAmount = tokenAmount * tokenPrice;
        require(address(this).balance >= etherAmount, "Vendor has insufficient ETH");

        // User must approve the contract to spend tokens before calling this
        carbonCreditToken.transferFrom(msg.sender, address(this), tokenAmount);
        payable(msg.sender).transfer(etherAmount);
    }

    // Claim tokens (e.g., as a reward)
    function claimTokens(uint256 tokenAmount) external {
        // Implement your claim logic here (e.g., eligibility checks)
        carbonCreditToken.transfer(msg.sender, tokenAmount);
    }

    // Allow the owner to withdraw ETH from the contract
    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    // Allow the owner to set a new token price
    function setTokenPrice(uint256 newPrice) external {
        require(msg.sender == owner, "Only owner can set price");
        tokenPrice = newPrice;
    }
}
