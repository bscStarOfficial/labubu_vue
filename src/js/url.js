import axios from "axios";

export function getQueryParameters(url) {
  let queryParameters = {};
  let queryString = url.split('#')[1]; // 获取问号后面的部分

  if (queryString) {
    let params = queryString.split('&');

    for (let i = 0; i < params.length; i++) {
      let param = params[i].split('=');
      let key = decodeURIComponent(param[0]);
      queryParameters[key] = decodeURIComponent(param[1]);
    }
  }

  return queryParameters;
}

export function getHost() {
  let port = window.location.port;
  let url = window.location.protocol + "//" + window.location.hostname;
  if (port) {
    return url + ":" + port
  } else {
    return url;
  }
}

export async function requestGet(url, parameters = {}) {
  let res = await axios.get(url, {
    params: parameters
  });
  return res.data.data;
}

export async function sleep(time) {
  await new Promise(resolve => {
    setTimeout(() => {
      resolve(1);
    }, time)
  })
}
