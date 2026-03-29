const addresses = {
  "56": {
    labubuNFT: "0xd96db14e54E9aFb07063344140198E2F549f186B",
    multiCall: "0xe981CF0D65Df9C37FB233eF33547a045df18E3f7",
    multiSign01: "0xB70689CB3Dd1B77E78Dd3f6AbdF4cD83e8D9dF4A",
    usdc: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    usdt: "0x55d398326f99059ff775485246999027b3197955",
    labubu: '0xe2Cd7905C6C119BC5E771D9434Aa3b87D27c703c',
    lp: '0xE12C28106CBF87BcA147Bad286E66e783337e611',
    manage: '0x504658d8ab5B2b0bb7823Eb111Cbe9DC67496279',
    recoupment: '0xA3458D8F8f6D32DABB838dcdEd42a9E781373aFE'
  },
  "5611": {
    labubuNFT: '0x37155f88D3b488883ca7B19E70013a7f890232C4',
    multiCall: '0x4b33282ea726A0246D954B659949770eD36CC686',
    multiSign01: '0x2A8FEff263B9e25eCE6daC24d6F88aB21e5300A4',
    usdc: '0x905bD34D98419542fb14ada7d6327e48ef37D88A',
    usdt: "0x905bD34D98419542fb14ada7d6327e48ef37D88A",
    labubu: "0xb3AacB2b8372693602e785393bB4bF98b47fA69E",
    lp: '0x905bD34D98419542fb14ada7d6327e48ef37D88A',
    manage: '0xc79Aff115A7B3fa0d04C8787f8f379Fcc3C71a24',
    recoupment: '0xf7Bb57AF57C84Bb27ce83bF661c9345d247701A9',
    swapFeeDividend: '0x4e4857b2Cf6bB4786dfc097bB0933b7E41FA883B'
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

