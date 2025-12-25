const addresses = {
  "56": {
    labubuNFT: "",
  },
  "5611": {
    labubuNFT: '0x37155f88D3b488883ca7B19E70013a7f890232C4',
    multiCall: '0x4b33282ea726A0246D954B659949770eD36CC686',
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

