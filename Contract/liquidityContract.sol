// SPDX-License-Identifier:None 

pragma solidity 0.8.7;

contract LiquidityContract {
    uint public LiquidityBalance;
    event DepositedInLiquidityContract(string msg,uint amount);
    constructor (){}    
    receive () payable external {
        LiquidityBalance =address(this).balance;
        emit DepositedInLiquidityContract("Deposited Liquidity In Contract" ,msg.value);
    }
    fallback() external {} 

    // NOTE: No other functionality was specified in the assignment

}