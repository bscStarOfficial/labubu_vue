const addresses = {
  "56": {
    labubuNFT: "",
  },
  "5611": {
    labubuNFT: '0x4057eB6A9416d782F01091F44942c0799c34C782',
  },
}

export async function getAddress(name) {
  const chainId = await getChainId();
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

