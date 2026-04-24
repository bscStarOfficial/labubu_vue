import {defineStore} from 'pinia'
import {aggregate, getCalls} from "@/js/contracts/multiCall";
import {labubuNFTFuncDecode} from "@/js/contracts/labubuNFT";
import BigNumber from "bignumber.js";
import {recoupmentTFuncDecode, recoupmentTFuncEncode} from "@/js/contracts/recoupment";
import {swapFeeDividendFuncDecode} from "@/js/contracts/swapFeeDividend";

export const useLabubuNFTStore = defineStore('labubuNFT', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => ({
    nftPrice: 0,
    pendingProfit: 0,
    fistTokenId: "-",
    payee: {
      released: 0,
      available: 0
    },
    recoupment: {
      deposit: 0,
      quota: 0,
      claimed: 0
    },
    swapFeeDividend: {
      pendingReward: "",
      share: "",
      claimed: "",
    }
  }),
  getters: {
    availableReward(state) {
      return new BigNumber(state.pendingProfit).plus(state.payee.available).toNumber();
    },
    recoupmentLeftQuota(state) {
      return new BigNumber(state.recoupment.quota).minus(state.recoupment.claimed).toFixed(2);
    }
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
          case 4:
            this.recoupment = recoupmentTFuncDecode('recoupments', data);
            break;
          case 5:
            this.swapFeeDividend.pendingReward = swapFeeDividendFuncDecode('pendingReward', data);
            break;
          case 6:
            this.swapFeeDividend.share = swapFeeDividendFuncDecode('userInfo', data);
            break;
          case 7:
            this.swapFeeDividend.claimed = swapFeeDividendFuncDecode('userClaimed', data);
            break;
        }
      })
    },
  },
})
