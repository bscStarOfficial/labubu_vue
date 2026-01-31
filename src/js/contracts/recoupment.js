import defaultAbi from '@/abis/recoupment';
import {getAddress} from "@/js/config";
import {getContract, getSendPram} from "@/js/web3";
import {BigNumber} from "bignumber.js";
import {Interface} from "ethers";

export async function getDefaultContract() {
  let defaultAddress = await getAddress('labubu');
  return await getContract(defaultAbi, defaultAddress)
}

export async function recoupmentTFuncEncode(func, args = []) {
  let imp = new Interface(defaultAbi);
  return [
    await getAddress('recoupment'),
    args.length === 0 ?
      imp.encodeFunctionData(func) : imp.encodeFunctionData(func, args),
  ]
}

export function recoupmentTFuncDecode(func, result) {
  let imp = new Interface(defaultAbi);
  let res = imp.decodeFunctionResult(func, result);
  if (func === 'recoupments') {
    return {
      deposit: new BigNumber(res[0]).dividedBy(1e18).toFixed(),
      quota: new BigNumber(res[1]).dividedBy(1e18).toFixed(),
      claimed: new BigNumber(res[2]).dividedBy(1e18).toFixed(),
    }
  }
  return res[0];
}


