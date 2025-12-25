import defaultAbi from '@/abis/multiSigBank';
import erc20Abi from '@/abis/erc20';
import {getAddress} from "@/js/config";
import {solidityPackedKeccak256, Interface, parseEther, formatEther} from "ethers";
import {getContract} from "@/js/web3";
import {postMessage} from "@/js/transaction";

export async function getDefaultContract(name) {
  let defaultAddress = await getAddress(name);
  return await getContract(defaultAbi, defaultAddress)
}

export async function submitTransaction(multiSigName, destinationName, type, address, amount = '0') {
  console.log(multiSigName, destinationName, type, address)
  let defaultContract = await getDefaultContract(multiSigName);
  let destination, imp, methodData, description, value = 0;
  if (destinationName != '')
    destination = await getAddress(destinationName);
  else {
    destination = address;
  }
  if (type == "transfer") {
    imp = new Interface(erc20Abi);
    methodData = imp.encodeFunctionData(type, [address, parseEther(amount)]);
    description = solidityPackedKeccak256(["string"], [destinationName])
  } else if (type == "send") {
    methodData = '0x';
    description = solidityPackedKeccak256(["string"], ['bnb'])
    value = parseEther(amount);
  } else if (type == "addOwner" || "removeOwner" || 'changeRequirement') {
    imp = new Interface(defaultAbi);
    methodData = imp.encodeFunctionData(type, [address]);
    description = solidityPackedKeccak256(["string"], [type])
  } else {
    throw new Error("type error")
  }
  const selectedAddress = window.ethereum?.selectedAddress;

  if (window?.ethereum?.platform == 'btn') {
    await postMessage({
      name: 'sendTx',
      target: defaultContract.target,
      data: defaultContract.interface.encodeFunctionData(
        "submitTransaction",
        [destination, value, methodData, description]
      )
    })
  } else {
    const sendParam = {from: selectedAddress};
    await defaultContract?.methods?.submitTransaction(destination, value, methodData, description).send(sendParam);
  }
}

export async function confirmTransaction(multiSigName, id) {
  let defaultContract = await getDefaultContract(multiSigName);
  const selectedAddress = window.ethereum?.selectedAddress;

  if (window?.ethereum?.platform == 'btn') {
    await postMessage({
      name: 'sendTx',
      target: defaultContract.target,
      data: defaultContract.interface.encodeFunctionData("confirmTransaction", [id])
    })
  } else {
    const sendParam = {from: selectedAddress};
    await defaultContract?.methods?.confirmTransaction(id).send(sendParam);
  }
}

export async function executeTransaction(multiSigName, id) {
  let defaultContract = await getDefaultContract(multiSigName);
  const selectedAddress = window.ethereum?.selectedAddress;

  if (window?.ethereum?.platform == 'btn') {
    await postMessage({
      name: 'sendTx',
      target: defaultContract.target,
      data: defaultContract.interface.encodeFunctionData("executeTransaction", [id])
    })
  } else {
    const sendParam = {from: selectedAddress};
    await defaultContract?.methods?.executeTransaction(id).send(sendParam);
  }
}

export async function discardTransaction(multiSigName, id) {
  let defaultContract = await getDefaultContract(multiSigName);
  const selectedAddress = window.ethereum?.selectedAddress;
  if (window?.ethereum?.platform == 'btn') {
    await postMessage({
      name: 'sendTx',
      target: defaultContract.target,
      data: defaultContract.interface.encodeFunctionData("discardTransaction", [id])
    })
  } else {
    const sendParam = {from: selectedAddress};
    await defaultContract?.methods?.discardTransaction(id).send(sendParam);
  }
}

export async function getTransactionsEncode(multiSigName, count = 500) {
  let imp = new Interface(defaultAbi);
  const selectedAddress = window.ethereum?.selectedAddress;
  return [
    await getAddress(multiSigName),
    imp.encodeFunctionData("getTransactions", [count, selectedAddress]),
  ]
}

export function getTransactionsDecode(result) {
  let imp = new Interface(defaultAbi);
  let res = imp.decodeFunctionResult("getTransactions", result)
  return res;
}

export async function isOwnerEncode(multiSigName) {
  const account = window.ethereum?.selectedAddress;
  let imp = new Interface(defaultAbi);
  return [
    await getAddress(multiSigName),
    imp.encodeFunctionData("isOwner", [account]),
  ]
}

export function isOwnerDecode(result) {
  let imp = new Interface(defaultAbi);
  let res = imp.decodeFunctionResult("isOwner", result)
  return res[0];
}

export async function decodeData(data, desc) {
  let res, imp;
  let transferHash = solidityPackedKeccak256(["string"], ["transfer"]);
  let usdcTransferHash = solidityPackedKeccak256(["string"], ["usdc"]);
  let usdtTransferHash = solidityPackedKeccak256(["string"], ["usdt"]);
  let bnbTransferHash = solidityPackedKeccak256(["string"], ['bnb']);
  let addOwnerHash = solidityPackedKeccak256(["string"], ["addOwner"]);
  let removeOwnerHash = solidityPackedKeccak256(["string"], ["removeOwner"]);

  if (desc == transferHash) {
    imp = new Interface(erc20Abi);
    res = imp.decodeFunctionData("transfer", data);
    return {
      address: res[0],
      amount: formatEther(res[1])
    };
  } else if (desc == usdcTransferHash) {
    imp = new Interface(erc20Abi);
    res = imp.decodeFunctionData("transfer", data);
    return {
      address: res[0],
      amount: "USDC " + formatEther(res[1])
    };
  } else if (desc == usdtTransferHash) {
    imp = new Interface(erc20Abi);
    res = imp.decodeFunctionData("transfer", data);
    return {
      address: res[0],
      amount: "USDT " + formatEther(res[1])
    };
  } else if (desc == bnbTransferHash) {
    return {
      address: '',
      amount: "BNB "
    };
  } else if (desc == addOwnerHash) {
    imp = new Interface(defaultAbi);
    res = imp.decodeFunctionData("addOwner", data);
    return {
      address: res[0],
      amount: "加员"
    };
  } else if (desc == removeOwnerHash) {
    imp = new Interface(defaultAbi);
    res = imp.decodeFunctionData("removeOwner", data);
    return {
      address: res[0],
      amount: "减员"
    };
  } else {
    return {
      address: '',
      amount: "未知"
    };
  }
}
