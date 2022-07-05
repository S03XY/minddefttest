import { Web3Provider } from "@ethersproject/providers";
import * as web3 from "ethers";
import { reserve_contract_abi, mindpayabi } from "./abi";
import { contractAddress } from "./contractAddress";

export const getConnection = async () => {
  // console.log("connecting to metamask..");
  const provider = new web3.ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();
  if (network.name !== "rinkeby") {
    alert("please connect to rinkeby network and try again ");
    return;
  }
  await provider.send("eth_requestAccounts", []);
  
  const signer = provider.getSigner();
  const signer_address = await signer.getAddress();

  // console.log("connected to metamask..");
  return { provider, signer_address };
};

export const calculateMinddayReward = (_input) => {
  // const _input = 1;

  let reward = 0;
  if (_input > 1 && _input < 5) {
    reward = _input * 1000 + _input * 0.1;
  } else if (_input > 5) {
    reward = _input * 1000 + _input * 0.2;
  } else {
    reward = _input * 1000;
  }
  return reward;
};

export const lockether = async (provider, amount) => {
  console.log("investing into mindday...");
  const contract = new web3.ethers.Contract(
    contractAddress.reserveContract,
    reserve_contract_abi,
    provider
  );
  let signer = provider.getSigner();
  let connected = contract.connect(signer);

  const formated = web3.ethers.utils.parseEther(amount.toString());
  const tx = await connected.lockEther({ value: formated });
  console.log(tx);
  await tx.wait();
  console.log("finished");
};

export const callCancelInvestment = async (provider) => {
  console.log("cancelling investment and returing eth..");
  const contract = new web3.ethers.Contract(
    contractAddress.reserveContract,
    reserve_contract_abi,
    provider
  );
  let signer = provider.getSigner();
  let connected = contract.connect(signer);
  const tx = await connected.cancelInvestMent();
  console.log(tx);
  await tx.wait();
  console.log("finished");
};

export const callStakeInvestment = async (provider) => {
  console.log("staking investment...");
  const contract = new web3.ethers.Contract(
    contractAddress.reserveContract,
    reserve_contract_abi,
    provider
  );
  let signer = provider.getSigner();
  let connected = contract.connect(signer);
  const tx = await connected.stakeInvestMent();
  console.log(tx);
  await tx.wait();
  console.log("finished");
};

export const gettokensupplyofmindpay = async (provider) => {
  console.log("getting total supply of mindpay...");
  const contract = new web3.ethers.Contract(
    contractAddress.minddayContract,
    mindpayabi,
    provider
  );
  console.log("contract", contract);
  const ts = await contract.totalSupply();
  let formated = web3.ethers.utils.formatEther(ts.toString(), "ether");
  return formated;
};

export const getusermindpay = async (provider, signer) => {
  console.log("getting user mindpay...");
  const contract = new web3.ethers.Contract(
    contractAddress.reserveContract,
    reserve_contract_abi,
    provider
  );
  const ts = await contract.User(signer);

  let formated = web3.ethers.utils.formatEther(
    ts.rewardEarned.toString(),
    "ether"
  );
  return formated;
};
