import defaultAbi from '@/abis/labubu';
import {getAddress} from "@/js/config";
import {getContract, getSendPram} from "@/js/web3";
import {postMessage} from "@/js/transaction";
import {BigNumber} from "bignumber.js";

export async function getDefaultContract() {
  let defaultAddress = await getAddress('labubu');
  return await getContract(defaultAbi, defaultAddress)
}

export async function dailyBurnRate(id) {
  let contract = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    return await contract.dailyBurnRate(id);
  } else {
    return await contract?.methods?.dailyBurnRate(id).call(getSendPram());
  }
}

export async function getMaxAmount() {
  let contract = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    return await contract.maxAmount();
  } else {
    return await contract?.methods?.maxAmount().call(getSendPram());
  }
}

export async function triggerDailyBurnAndMint() {
  let labubu = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    await postMessage({
      name: 'sendTx',
      target: labubu.target,
      data: labubu.interface.encodeFunctionData("triggerDailyBurnAndMint")
    })
  } else {
    await labubu?.methods?.triggerDailyBurnAndMint().send(getSendPram());
  }
}

export async function setDailBurnRate(rates) {
  let labubu = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    await postMessage({
      name: 'sendTx',
      target: labubu.target,
      data: labubu.interface.encodeFunctionData("setDailBurnRate", rates)
    })
  } else {
    await labubu?.methods?.setDailBurnRate(rates).send(getSendPram());
  }
}

export async function setMaxAmount(amount) {
  amount = new BigNumber(amount).multipliedBy(1e18).toFixed();
  let labubu = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    await postMessage({
      name: 'sendTx',
      target: labubu.target,
      data: labubu.interface.encodeFunctionData("setMaxAmount", [amount])
    })
  } else {
    await labubu?.methods?.setMaxAmount(amount).send(getSendPram());
  }
}
