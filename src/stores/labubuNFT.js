import {defineStore} from 'pinia'
import {aggregate, getCalls} from "@/js/contracts/multiCall";
import {labubuNFTFuncDecode} from "@/js/contracts/labubuNFT";
import BigNumber from "bignumber.js";

export const useLabubuNFTStore = defineStore('labubuNFT', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => ({
    nftPrice: 0,
    pendingProfit: 0,
    fistTokenId: 9999999,
    payee: {
      released: 0,
      available: 0
    }
  }),
  getters: {
    availableReward(state) {
      return new BigNumber(state.pendingProfit).plus(state.payee.available).toNumber();
    },
  },
  actions: {
    async setState(callIds = []) {
      let res = await aggregate(await getCalls(callIds));
      res.forEach((data, index) => {
        switch (callIds[index]) {
          case 0:
            this.pendingProfit = labubuNFTFuncDecode('pendingProfit', data);
            break;
          case 1:
            this.nftPrice = labubuNFTFuncDecode('nftPrice', data)
            break
          case 2:
            this.payee = labubuNFTFuncDecode('payees', data);
            break;
          case 3:
            this.fistTokenId = labubuNFTFuncDecode('fistTokenId', data);
            break;
        }
      })
    },
  },
})
