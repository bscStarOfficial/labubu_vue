import defaultAbi from '@/abis/swapFeeDividend';
import {getAddress} from "@/js/config";
import {getContract, getSendPram} from "@/js/web3";
import {postMessage} from "@/js/transaction";
import {Interface} from "ethers";
import BigNumber from "bignumber.js";

export async function getDefaultContract() {
  let defaultAddress = await getAddress('swapFeeDividend');
  return await getContract(defaultAbi, defaultAddress);
}

export async function userInfo(account) {
  let contract = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    return await contract.userInfo(account);
  } else {
    return await contract?.methods?.userInfo(account).call(getSendPram());
  }
}

export async function setShare(account, shares) {
  let contract = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    await postMessage({
      name: 'sendTx',
      target: contract.target,
      data: contract.interface.encodeFunctionData("setShare", [account, shares])
    });
  } else {
    await contract?.methods?.setShare(account, shares).send(getSendPram());
  }
}

export async function sendReward(amount) {
  let contract = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    await postMessage({
      name: 'sendTx',
      target: contract.target,
      data: contract.interface.encodeFunctionData("sendReward", [amount])
    });
  } else {
    await contract?.methods?.sendReward(amount).send(getSendPram());
  }
}

export async function totalShares() {
  let contract = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    return await contract.totalShares();
  }
  return await contract?.methods?.totalShares().call(getSendPram());
}

export async function claim() {
  let contract = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    await postMessage({
      name: 'sendTx',
      target: contract.target,
      data: contract.interface.encodeFunctionData("claim", [])
    });
  } else {
    await contract?.methods?.claim().send(getSendPram());
  }
}

export async function swapFeeDividendFuncEncode(func, args = []) {
  let imp = new Interface(defaultAbi);
  return [
    await getAddress('swapFeeDividend'),
    args.length === 0 ?
      imp.encodeFunctionData(func) : imp.encodeFunctionData(func, args),
  ];
}

export function swapFeeDividendFuncDecode(func, result) {
  let imp = new Interface(defaultAbi);
  let res = imp.decodeFunctionResult(func, result);
  if (func === 'pendingReward') {
    const value = res.pendingReward ?? res[0];
    return new BigNumber(value.toString()).dividedBy(1e18).toFixed(1, 1);
  }
  if (func === 'userClaimed') {
    const value = res.userClaimed ?? res[0];
    return new BigNumber(value.toString()).dividedBy(1e18).toFixed(1, 1);
  }
  if (func === 'userInfo') {
    const shareValue = res.share ?? res[0];
    return new BigNumber(shareValue.toString()).toFixed(0);
  }
  return res[0];
}
