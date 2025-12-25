const addresses = {
  "56": {
    labubuNFT: "",
    multiCall: "",
    multiSign01: "",
    usdc: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    usdt: "0x55d398326f99059ff775485246999027b3197955",
  },
  "5611": {
    labubuNFT: '0x37155f88D3b488883ca7B19E70013a7f890232C4',
    multiCall: '0x4b33282ea726A0246D954B659949770eD36CC686',
    multiSign01: '0x2A8FEff263B9e25eCE6daC24d6F88aB21e5300A4',
    usdc: '0x905bD34D98419542fb14ada7d6327e48ef37D88A',
    usdt: "0x905bD34D98419542fb14ada7d6327e48ef37D88A",
  },
}

export async function getAddress(name) {
  const chainId = await getChainId();
  console.log({chainId})
  return addresses[chainId][name];
}

export async function getChainId() {
  if (window?.ethereum?.platform == 'btn') {
    return window?.ethereum?.chainId
  } else {
    let chainId = await window.ethereum.request({method: 'eth_chainId'});
    return parseInt(chainId, 16).toString()
  }
}

export function getNFTImage(image) {
  return new URL(`../assets/nft/${image}.png`, import.meta.url).href;
}

