import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  calculateMinddayReward,
  callCancelInvestment,
  callStakeInvestment,
  getConnection,
  gettokensupplyofmindpay,
  getusermindpay,
  lockether,
} from "./apis";
import "./App.css";

const data = [1, 2, 3];

export const App = () => {
  const [isinstalled, setisinstalled] = useState(false);
  const [wallet, setwallet] = useState(undefined);
  const [siger, setsigner] = useState(undefined);
  const [rewards, setreward] = useState(undefined);
  const [ether_amount, setether_amount] = useState(undefined);
  const [usermindpay, setusermindpay] = useState(0);
  const [totolminddaysupply, settotolminddaysupply] = useState(0);
  useEffect(() => {
    if (window.ethereum) {
      setisinstalled(true);
    } else {
      setisinstalled(false);
    }
  }, [window.ethereum]);

  useEffect(() => {
    const called = async () => {
      if (wallet !== undefined) {
        const _res = await gettokensupplyofmindpay(wallet);
        settotolminddaysupply(_res);
        const res = await getusermindpay(wallet, siger);
        setusermindpay(res);
      }
    };

    called();
  }, [wallet]);

  const ethref = useRef();
  const onhandleconnect = async () => {
    const { provider, signer_address } = await getConnection();
    setwallet(provider);
    setsigner(signer_address);
  };

  const onchangeInput = (input) => {
    if (input < 0.000000001) {
      ethref.current.classList.add(["danger"]);
      setreward("Too less to Compute");
      return;
    } else {
      ethref.current.classList.remove(["danger"]);
      const response = calculateMinddayReward(input);
      setreward(response.toFixed(2));
    }
  };

  const onhandleinvestment = () => {
    if (wallet === undefined) {
      alert("Please connect your wallet first..");
    }
    lockether(wallet, ether_amount);
  };

  const onhandlecancelinvestment = () => {
    if (wallet === undefined) {
      alert("Please connect your wallet first..");
    }
    callCancelInvestment(wallet);
  };

  const onhandlestakeinvestment = () => {
    if (wallet === undefined) {
      alert("Please connect your wallet first..");
    }
    callStakeInvestment(wallet);
  };

  return !isinstalled ? (
    <div>MetaMask Not Installed</div>
  ) : (
    <div>
      <span style={{ color: "red" }}>
        <b>NOTE: </b>
        Only that logic is implemented which was given in the task nothing more
        nothing less
      </span>{" "}
      <br />
      <div className="mt">
        NOTE: Contract is deployed on <b>Rinkeby Testnet</b>
      </div>
      <button onClick={onhandleconnect} className="mt">
        {wallet !== undefined
          ? `Connected to : ${siger}`
          : "Connect to metamask"}
      </button>
      <div className="mt">
        <input
          type="number"
          ref={ethref}
          min={1000}
          value={ether_amount === undefined ? "" : ether_amount}
          placeholder="Ether ETH"
          onWheel={(e) => e.target.blur()}
          onChange={(e) => {
            e.target.value !== ""
              ? setether_amount(Number(e.target.value))
              : setether_amount(undefined);

            e.target.value !== ""
              ? onchangeInput(Number(e.target.value))
              : setreward(undefined);
          }}
        />
        &nbsp;=&nbsp;
        <input
          type="text"
          value={rewards ? rewards : ""}
          disabled
          placeholder="Equivalent MIND PAY"
        />
      </div>
      <div className="mt">
        <button onClick={onhandleinvestment}>Invest Into MINDPAY</button>
        &nbsp;
        <input
          type="text"
          disabled
          placeholder={`total Supply of MIND PAY : ${totolminddaysupply}`}
        />
      </div>
      <div className="mt">
        NOTE: For testing purpose the actual contract is deployed with{" "}
        <b>2 minutes locking period</b>
      </div>
      <div className="mt">
        <input
          type="text"
          disabled
          style={{ width: "300px" }}
          placeholder={`MINDPAY balace of the user : ${usermindpay}`}
        />
        &nbsp;
        <button onClick={onhandlecancelinvestment}>
          Cancel Investment
        </button>{" "}
        &nbsp;
        <button onClick={onhandlestakeinvestment}>Stake your Investment</button>
      </div>
      <div className="mt">
        {" "}
        Transaction History{" "}
        <span style={{ color: "red" }}>
          <b>NOTE:</b> No erc20 is tranferred from/to users wallet and hence
          this is dummy data
        </span>{" "}
      </div>
      <table className="mt">
        <tr>
          <th>Tokens</th>
          <th>Status</th>
          <th>Transaction History</th>
        </tr>

        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>eth</td>
              <td>Success</td>
              <td>11111111111111111111111111111111111111111111111111111111</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
