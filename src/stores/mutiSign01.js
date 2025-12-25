import {defineStore} from 'pinia'
import {decodeData, getTransactionsDecode, getTransactionsEncode, isOwnerDecode, isOwnerEncode} from "@/js/contracts/multiSign"
import {balanceOfDecode, balanceOfEncode} from "@/js/contracts/erc20s";
import {getAddress} from "@/js/config";
import {formatNumber18} from "@/js/math";
import {aggregate} from "@/js/contracts/multiCall";

export const useMultiSignStore = defineStore('multiSign01', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => ({
    usdtBalance: 0,
    usdcBalance: 0,
    bnbBalance: 0,
    isOwner: false,
    transactions: []
  }),
  getters: {},
  actions: {
    async setState() {
      let address = await getAddress("multiSign01");
      let encodeData = [
        await balanceOfEncode('usdt', address),
        await balanceOfEncode('usdc', address),
        await isOwnerEncode('multiSign01'),
        [address, '0x'],
        await getTransactionsEncode('multiSign01'),
      ];
      let res = await aggregate(encodeData);
      this.usdtBalance = balanceOfDecode(res[0]);
      this.usdcBalance = balanceOfDecode(res[1]);
      this.isOwner = isOwnerDecode(res[2]);
      this.bnbBalance = formatNumber18(res[3]);
      let txs = getTransactionsDecode(res[4]);

      this.transactions = [];
      let transactions = await formatTxs(txs);
      for (let i in transactions) {
        if (parseInt(i) < 8) {
          this.transactions.push(transactions[i]);
        }
      }
    },
  },
})

async function formatTxs(txs) {
  let _transactions = txs[0];
  let transactions = [];
  let isAccountConfirms = txs[1];
  let confirms = txs[2];
  let ids = txs[3];

  _transactions.forEach(item => {
    transactions.push({
      description: item[0],
      createTime: item[1],
      destination: item[2],
      value: item[3],
      data: item[4],
      submitter: item[5],
      executed: item[6],
    })
  })

  let formatTransactions = [];
  for (let i in transactions) {
    let d = await decodeData(transactions[i].data, transactions[i].description);
    console.log(d)
    if (d.address == '') {
      d = {
        address: transactions[i].destination,
        amount: "BNB " + formatNumber18(transactions[i].value.toString())
      }
    }
    formatTransactions.push({
      ...transactions[i], ...d,
      isAccountConfirms: isAccountConfirms[i],
      confirms: confirms[i],
      id: ids[i]
    })
  }

  return formatTransactions;
}
