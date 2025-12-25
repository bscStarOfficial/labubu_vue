import {JsonRpcProvider} from "ethers";

export function getRpcProvider() {
  if (window?.ethereum?.chainId == "56") {
    return new JsonRpcProvider(bscRpc())
  } else {
    return new JsonRpcProvider(testRpc())
  }
}

function bscRpc() {
  return 'https://bsc-dataseed.bnbchain.org';

  let rpcs = [
    "https://rpc.ankr.com/bsc/67bef6f0a3be329409d7972acff95679c5cf74707a3dc653456930e22b497628",
    'https://rpc.ankr.com/bsc/79d902969e1bdec817385070cbd3dbf53ac41fd80762709782b39c9e641c0059',
    'https://rpc.ankr.com/bsc/805167a24b8e7e42822bef6d5b81be6e136f777141fb11363f6aa19909cc0cbd',
    'https://rpc.ankr.com/bsc/5c5670e66cbd482869d56f01072ca3c3a3da2180f5d1759474d8588546d5118a',
    'https://rpc.ankr.com/bsc/d72882e5c359a4ab1ca53ec87535a761388500fc84bfa0e8095e64d6c09ac370',
    'https://rpc.ankr.com/bsc/36d9e96e6b56e9eb728e29268f596780647330f462d1329d3ed73d3a07dd5d31'
  ];
  let key = new Date().getTime() % 6;
  return rpcs[key];
}

function testRpc() {
  return 'https://opbnb-testnet-rpc.bnbchain.org';
}
