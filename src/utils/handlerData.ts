export function handlerPlayNume(num: number) { // 处理播放数量
  // 处理播放数量
  if (num > 99999 && num <= 99999999) {
    return (num / 10000).toFixed(1) + '万'
  } else if (num > 99999999) {
    return (num / 100000000).toFixed(1) + '亿'
  } else {
    return num
  }
}