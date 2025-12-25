import BigNumber from "bignumber.js";

export function formatNumber18(number, fixed = 4) {
  let amount = new BigNumber(number).dividedBy(1e18).toFixed(fixed, 1);
  return Number(amount);
}
