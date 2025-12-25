import defaultAbi from '@/abis/multiCall';
import {getAddress} from "@/js/config";
import {getContract, getSelectedAddress} from "@/js/web3";
import {labubuNFTFuncEncode} from "@/js/contracts/labubuNFT";

export async function getDefaultContract() {
  let defaultAddress = await getAddress("multiCall");
  return await getContract(defaultAbi, defaultAddress)
}

export async function aggregate(calls) {
  let contract = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    return await contract.aggregate(calls);
  } else {
    const sendParam = {from: window.ethereum?.selectedAddress};
    return await contract?.methods?.aggregate(calls).call(sendParam);
  }
}

export async function getCalls(callIds = [], user = '') {
  if (user === '') user = getSelectedAddress();
  let calls = [];
  for (let id of callIds) {
    switch (id) {
      case 0:
        calls.push(await labubuNFTFuncEncode('pendingProfit', [user]));
        break;
      case 1:
        calls.push(await labubuNFTFuncEncode('nftPrice'));
        break;
      case 2:
        calls.push(await labubuNFTFuncEncode('payees', [user]));
        break;
      case 3:
        calls.push(await labubuNFTFuncEncode('fistTokenId', [user]));
        break;
    }
  }
  return calls;
}
