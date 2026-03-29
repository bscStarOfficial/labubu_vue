import defaultAbi from '@/abis/swapFeeDividend';
import {getAddress} from "@/js/config";
import {getContract, getSendPram} from "@/js/web3";
import {postMessage} from "@/js/transaction";

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
