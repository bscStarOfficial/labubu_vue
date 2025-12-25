import BigNumber from "bignumber.js";

export function toAmountK(amount) {
  let am = new BigNumber(amount);
  if (am.gte("1000")) {
    return am.div("1000").toFixed(3) + "k"
  } else {
    return am.toFixed(3);
  }
}

export function toAmountK0(amount) {
  let am = new BigNumber(amount);
  if (am.gte("1000")) {
    return am.div("1000").toFixed(0) + "k"
  } else {
    return am.toFixed(0);
  }
}

export function toFixed(amount, n) {
  return new BigNumber(amount).toFixed(n);
}

export function div18(amount, decimals) {
  let res = new BigNumber(amount).dividedBy(1e18)
    .toFixed(decimals, 1);
  return Number(res);
}

export function replaceMiddleWithAsterisks(inputString) {
  if (inputString == "") return ""
  const firstFiveCharacters = inputString.substring(0, 6);
  const lastFiveCharacters = inputString.substring(inputString.length - 5);
  return firstFiveCharacters + "****" + lastFiveCharacters
}

