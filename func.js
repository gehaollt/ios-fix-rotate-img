/**
 * 是否ios
 */
export const isIos = () =>
  !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

/**
 * 获取ios版本
 */
export function getIosVerStr() {
  let userAgent = navigator.userAgent
  let reg = /CPU iPhone OS (.*?) like Mac OS/i
  let verStr = userAgent.match(reg)[1]
  return verStr.replace(/_/g, '.')
}

/**
 * 比较两个版本号大小
 * @param {*} ver
 */
export function isVerLessThan(ver, compareVer) {
  let verArr = ver.split('.')
  let compareVerArr = compareVer.split('.')
  let minLength = Math.max(compareVerArr.length, verArr.length)
  for (let i = 0; i < minLength; i++) {
    if (verArr[i] < compareVerArr[i]) {
      return true
    }
  }
  return false
}
