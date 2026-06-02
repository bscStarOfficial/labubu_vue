import defaultAbi from '@/abis/manage';
import {getAddress} from "@/js/config";
import {getContract, getSelectedAddress, getSendPram} from "@/js/web3";
import {Interface} from "ethers";
import {postMessage} from "@/js/transaction";
import BigNumber from "bignumber.js";

export async function getDefaultContract() {
  let defaultAddress = await getAddress('manage');
  return await getContract(defaultAbi, defaultAddress)
}


export async function grantRole(role, address) {
  let manage = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    await postMessage({
      name: 'sendTx',
      target: manage.target,
      data: manage.interface.encodeFunctionData("grantRole", [role, address])
    })
  } else {
    await manage?.methods?.grantRole(role, address).send(getSendPram());
  }
}

export async function revokeRole(role, address) {
  let manage = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    await postMessage({
      name: 'sendTx',
      target: manage.target,
      data: manage.interface.encodeFunctionData("revokeRole", [role, address])
    })
  } else {
    await manage?.methods?.revokeRole(role, address).send(getSendPram());
  }
}

export async function hasRole(role, address) {
  let manage = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    return await manage.hasRole(role, address);
  } else {
    return await manage?.methods?.hasRole(role, address).call();
  }
}

