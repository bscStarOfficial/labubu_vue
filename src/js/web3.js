import Web3 from 'web3';
import {Contract} from "ethers";
import {getRpcProvider} from "@/js/rpc";

export function getWeb3() {
  let code = window.ethereum ? 1 : (window.web3 ? 2 : 0)
  switch (code) {
    case 1:
      return windowEthereum();
    case 2:
      return windowWeb3();
    default:
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      return {web3: null, ethereum: null};
  }
}

async function windowEthereum() {
  const {ethereum} = window;
  window.web3 = new Web3(ethereum);
  try {
    // Request account access if needed
    // let time = parseInt(localStorage.getItem("lastAccountRequest"));
    // if(nowTimestamp() - time > 30) {
    await ethereum.request({method: 'eth_requestAccounts'});
    //   localStorage.setItem("lastAccountRequest", nowTimestamp().toString());
    // }
    return {web3: window.web3, ethereum};
  } catch (error) {
    return {web3: null, ethereum: null}
  }
}

export function getSelectedAddress() {
  return window.ethereum?.selectedAddress;
}

export function newBN(str) {
  return Web3.utils.toBN(str)
}

export function newBN18(str) {
  return Web3.utils.toBN(str).mul(newBN("1000000000000000000"))
}

async function windowWeb3() {
  window.web3 = new Web3(web3.currentProvider);
  return {web3: window.web3, ethereum: null};
}


export async function getContract(abi, address) {
  if (window?.ethereum?.platform == 'btn') {
    return new Contract(address, abi).connect(getRpcProvider());
  } else {
    const web3 = window.web3;
    return new web3.eth.Contract(abi, address);
  }
}

export function getSendPram() {
  return {
    from: getSelectedAddress(),
  }
}
