import defaultAbi from '@/abis/erc20';
import {getAddress} from "@/js/config";
import {Interface} from "ethers";
import BigNumber from "bignumber.js";
import {getContract, getSendPram} from "@/js/web3";

export async function getErc20(erc20Name) {
  let defaultAddress = await getAddress(erc20Name);
  return await getContract(defaultAbi, defaultAddress)
}

export async function approve(erc20Name, to, amount) {
  let card = await getErc20(erc20Name);
  await card?.methods?.approve(to, amount).send(await getSendPram());
}

export async function balanceOfEncode(name, account) {
  let imp = new Interface(defaultAbi);
  return [
    await getAddress(name),
    imp.encodeFunctionData("balanceOf", [account]),
  ]
}

export function balanceOfDecode(result, decimal = 1e18) {
  let imp = new Interface(defaultAbi);
  let res = imp.decodeFunctionResult("balanceOf", result)
  let balance = new BigNumber(res[0].toString()).dividedBy(decimal).toFixed(2, 1)
  return Number(balance);
}

export async function allowanceEncode(name, spender) {
  let imp = new Interface(defaultAbi);
  const owner = window.ethereum?.selectedAddress;
  return [
    await getAddress(name),
    imp.encodeFunctionData("allowance", [owner, spender]),
  ]
}

export function allowanceDecode(result, decimal = 1e18) {
  let imp = new Interface(defaultAbi);
  let res = imp.decodeFunctionResult("allowance", result)
  return new BigNumber(res[0].toString()).dividedBy(decimal).toNumber()
}

export async function totalSupplyEncode(name) {
  let imp = new Interface(defaultAbi);
  return [
    await getAddress(name),
    imp.encodeFunctionData("totalSupply"),
  ]
}

export function totalSupplyDecode(result, decimal = 1e18) {
  let imp = new Interface(defaultAbi);
  let res = imp.decodeFunctionResult("totalSupply", result)
  let amount = new BigNumber(res[0].toString()).dividedBy(decimal).toFixed(4);
  return Number(amount)
}
