import defaultAbi from '@/abis/labubuNFT';
import {getAddress} from "@/js/config";
import {getContract, getSelectedAddress, getSendPram} from "@/js/web3";
import {Interface} from "ethers";
import {postMessage} from "@/js/transaction";

export async function getDefaultContract() {
  let defaultAddress = await getAddress('labubuNFT');
  return await getContract(defaultAbi, defaultAddress)
}


export async function claim() {
  let nft = await getDefaultContract();
  if (window?.ethereum?.platform == 'btn') {
    await postMessage({
      name: 'sendTx',
      target: nft.target,
      data: nft.interface.encodeFunctionData("claim", [getSelectedAddress()])
    })
  } else {
    await nft?.methods?.claim(getSelectedAddress()).send(getSendPram());
  }
}

export async function labubuNFTFuncEncode(func, args = []) {
  let imp = new Interface(defaultAbi);
  return [
    await getAddress('labubuNFT'),
    args.length === 0 ?
      imp.encodeFunctionData(func) : imp.encodeFunctionData(func, args),
  ]
}

export function labubuNFTFuncDecode(func, result) {
  let imp = new Interface(defaultAbi);
  let res = imp.decodeFunctionResult(func, result);
  if (func === 'pendingProfit' || func === 'nftPrice' || func === 'fistTokenId') {
    return new BigNumber(res[0]).dividedBy(1e18).toFixed(4)
  } else if (func === 'payees') {
    return {
      released: new BigNumber(res[0]).dividedBy(1e18).toFixed(),
      available: new BigNumber(res[1]).dividedBy(1e18).toFixed(),
    }
  }
  return res[0];
}

