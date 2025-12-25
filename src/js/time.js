export function nowTimestamp() {
  return parseInt(new Date().getTime() / 1000);
}

export function utcToTime1(str) {
  let date = new Date(str);
  const timeZoneOffset = 8 * 60; // 中国在UTC+8时区
  const beijingTime = new Date(date.getTime() - (timeZoneOffset * 60000));
  const beijingDate = new Date(beijingTime);
  return beijingDate.getMonth() + 1 + "-" + beijingDate.getDate() + " " + beijingDate.getHours() + ":" + beijingDate.getMinutes()
}

export function timestampFormat(str) {
  str = Number(str + "000")
  let date = new Date(str);

  let month = date.getMonth() + 1
  month = month < 10 ? '0' + month : month;

  let day = date.getDate();
  day = day < 10 ? '0' + day : day;

  let hours = date.getHours();
  hours = hours < 10 ? '0' + hours : hours;

  let minutes = date.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return month + "-" + day + " " + hours + ":" + minutes
}

export function timestampFormat2(str) {
  str = Number(str + "000")
  let date = new Date(str);
  return date.getMonth() + 1 + "-" + date.getDate()
}

export function countdownTime(time) {
  let now = nowTimestamp();
  if (now > time) return 0;
  return (time - now) * 1000;
}

export function countdownTime2(time1, time2) {
  let time = time1 > time2 ? time2 : time1;
  return (time - nowTimestamp()) * 1000;
}

export function getZeroTime() {
  // 获取当前日期字符串（北京时间）
  const dateStr = new Date().toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  // 解析为北京时间0点
  const [year, month, day] = dateStr.split(/[/\s]/);
  const beijingMidnight = new Date(`${year}-${month}-${day}T00:00:00+08:00`);

  const timestamp = beijingMidnight.getTime();

  return parseInt(timestamp / 1000);
}
