// SPDX-License-Identifier:None

pragma solidity 0.8.7;


import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";



contract MindDay is ERC20 {
    address private contractOwner;
    constructor (string memory _name,string memory _symbol,address _owner) ERC20(_name,_symbol){
        contractOwner =_owner;  
    } 
    modifier checkOwner {
        require(msg.sender == contractOwner,"Invalid Owner");
        _;
    }
    event TokenMint(string message,uint amount);
    event TokenBurn(string message,uint amount);

    function safeMint(address address_to_mint_to,uint amount) checkOwner external {
       _mint(address_to_mint_to,amount);
       emit TokenMint("MINDPAY token minted",amount);
    }

    function safeBurn (address address_to_mint_to,uint amount) checkOwner external {
       _burn(address_to_mint_to,amount);
       emit TokenBurn("MINDPAY token minted",amount);
    } 

    function safeTransfer (address to, uint amount) checkOwner external {
        transfer(to,amount);
    }

    
   // NOTE: no other functionalty was specified in th assigment for this contract    
}