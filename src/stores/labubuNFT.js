import {defineStore} from 'pinia'
import {aggregate, getCalls} from "@/js/contracts/multiCall";
import {referralFuncDecode} from "@/js/contracts/referral";
import {balanceOfDecode} from "@/js/contracts/erc20s";
import {stakingFuncDecode} from "@/js/contracts/staking";
import {labubuNFTFuncDecode} from "@/js/contracts/labubuNFT";

export const useStakingStore = defineStore('staking', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => ({
    nftPrice: 0,
    pendingProfit: 0,
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
            this.pendingProfit = labubuNFTFuncDecode('getReferral', data);
            break;
          case 1:
            this.nftPrice = labubuNFTFuncDecode('nftPrice', data)
            break
          case 2:
            this.payee = labubuNFTFuncDecode('payees', data);
            break;
        }
      })
    },
  },
})
