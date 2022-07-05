// SPDX-License-Identifier:None

pragma solidity 0.8.7;

import "./mindDay.sol";

contract ReserveContract {
    address private contractAdmin;
    address public liquidityContract;
    address public stakingContract;
    MindDay public minddayContract;
    

    constructor(address _liquidityContract,address _stakingContract){
        contractAdmin =msg.sender;
        liquidityContract =_liquidityContract;
        stakingContract =_stakingContract;
        MindDay mindday = new MindDay("MINDDAY","MND",address(this));
        minddayContract = mindday;
    }

    struct UserInfo {
        uint startdate;
        uint enddate;
        uint etherStaked;
        uint rewardEarned;
    }
    mapping (address => UserInfo) public User;
    mapping(address=> bool) public UserExits;


    modifier CheckUser (){
        require(UserExits[msg.sender] == true ,"Invalid user");
        _;
    }

    modifier CheckEndTime (){
        require (block.timestamp > User[msg.sender].enddate,"Ether locked");
        _;      
    }

    function lockEther() payable external {
        if (UserExits[msg.sender] == false){            
        lockForNewUser(msg.sender,msg.value);
        }
        else {
            // what to do with personal who has aleady locked the ether and his locking period is expired 
            revert("NOT Mentioned in assignment");
        }
    }

    // Get total reserved Ether in the contract
    function getContractBalance () view external returns(uint) {
        return address(this).balance;
    } 

    // Will create lock for 15 minutes for new user  as mention in the assigment 
    function lockForNewUser (address user,uint amount) internal {
        require(amount > 10000,"amount too less");
        uint mindDayReward = calcuteReward(amount);
        User[user] = UserInfo(block.timestamp,block.timestamp + 2 minutes,amount,mindDayReward);
        UserExits[user]=true;
        uint amount_to_send = amount/10;
        // (bool mintstatus,)= minddayContract.call(abi.encodeWithSignature('safeMint(address,uint)', address(this), mindDayReward));
        // require(mintstatus == true,"token minting failed");
        minddayContract.safeMint(address(this),mindDayReward);

        (bool status,) = liquidityContract.call{value:amount_to_send}("");
        require(status == true,"liquidity contract trasfer failed");
    }



    // modifier  checks for the endtime and does user exits
    function cancelInvestMent() CheckUser() CheckEndTime() external {
        UserInfo storage userinfo = User[msg.sender];
        uint returned_amount = (userinfo.etherStaked / 10) * 9;
        uint amount_to_burn =userinfo.rewardEarned;
        userinfo.etherStaked =0;
        userinfo.rewardEarned =0;
        // (bool burnstatus,)= minddayContract.call(abi.encodeWithSignature('safeBurn(address,uint)', address(this), amount_to_burn));
        // require(burnstatus == true,"token burning failed"); // burning all MindDay token
        minddayContract.safeBurn(address(this),amount_to_burn);
        payable(address(msg.sender)).transfer(returned_amount);
    }


    function stakeInvestMent() CheckUser() CheckEndTime() external {
        UserInfo storage userinfo = User[msg.sender];
        uint ether_amount = (userinfo.etherStaked / 10) * 9; // getting user 90 ether 
        //  (bool transferstatus,)= minddayContract.call(abi.encodeWithSignature('safeTransfer(address,uint)', stakingContract, userinfo.rewardEarned));
        // require(transferstatus == true,"token transfer failed"); // transfer 90% ether to liquidity contract
        minddayContract.safeTransfer(stakingContract, userinfo.rewardEarned);
        (bool status,) = liquidityContract.call{value:ether_amount}("");
        require(status == true,"liquidity contract trasfer failed"); //transfer all MinDay tokens to staking contract

    }

    function calcuteReward (uint amount) pure  internal returns(uint){
        if (amount > 1 ether && amount < 5 ether ){
            return  (amount * 1000) +(amount/10);  //10 % of the amount 
        }
        else if (amount > 5 ether){
            return (amount * 1000)+(amount/5); // 20 % of the amount
        }
        else {
            return (amount * 1000);
        }

    }

    

    receive () payable external{}
    fallback () external{}

}
