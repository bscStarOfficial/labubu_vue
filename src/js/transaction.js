export async function postMessage({name, target, value, data}) {
  let txs = [{
    revertOnError: true,
    gasLimit: 0,
    target,
    value: value ? value : 0,
    data
  }];

  if (window?.ReactNativeWebView) {
    console.log('send')
    let txId = new Date().getTime();
    window.ReactNativeWebView.postMessage(JSON.stringify({
      name, txs, txId
    }));

    await new Promise((resolve, reject) => {
      let it = setInterval(() => {
        let txResult = window?.ethereum?.txResult ? JSON.parse(window?.ethereum?.txResult) : {};
        console.log(txResult);
        if (txResult.hasOwnProperty(txId)) {
          let res = txResult[txId];
          if (res == 1) {
            clearInterval(it)
            resolve(1);
          } else if (res == 2) {
            clearInterval(it)
            reject('wallet error');
          }
        }
      }, 200);
    })
  }
}
