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

export async function sellFeeRate() {
  let contract = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    return await contract.sellFeeRate();
  } else {
    return await contract?.methods?.sellFeeRate().call(getSendPram());
  }
}

export async function sellFeeDeclineMultiplier() {
  let contract = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    return await contract.sellFeeDeclineMultiplier();
  } else {
    return await contract?.methods?.sellFeeDeclineMultiplier().call(getSendPram());
  }
}

export async function dailySellBnbLimit() {
  let contract = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    return await contract.dailySellBnbLimit();
  } else {
    return await contract?.methods?.dailySellBnbLimit().call(getSendPram());
  }
}

export async function dailySoldBnbAmount(timeKey = Math.floor(Date.now() / 1000 / 86400) * 86400) {
  let contract = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    return await contract.dailySoldBnbAmount(timeKey);
  } else {
    return await contract?.methods?.dailySoldBnbAmount(timeKey).call(getSendPram());
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

export async function setSellFeeRate(rate) {
  let labubu = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    await postMessage({
      name: 'sendTx',
      target: labubu.target,
      data: labubu.interface.encodeFunctionData("setSellFeeRate", [rate])
    })
  } else {
    await labubu?.methods?.setSellFeeRate(rate).send(getSendPram());
  }
}

export async function setSellFeeDeclineMultiplier(multiplier) {
  let labubu = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    await postMessage({
      name: 'sendTx',
      target: labubu.target,
      data: labubu.interface.encodeFunctionData("setSellFeeDeclineMultiplier", [multiplier])
    })
  } else {
    await labubu?.methods?.setSellFeeDeclineMultiplier(multiplier).send(getSendPram());
  }
}

export async function setDailySellBnbLimit(limit) {
  let labubu = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    await postMessage({
      name: 'sendTx',
      target: labubu.target,
      data: labubu.interface.encodeFunctionData("setDailySellBnbLimit", [limit])
    })
  } else {
    await labubu?.methods?.setDailySellBnbLimit(limit).send(getSendPram());
  }
}
