var LSUtils = {}
LSUtils.setItemWithMaxAge = function (key, value, maxAge) {
  var curTime = new Date().getTime()
  localStorage.setItem(key, JSON.stringify({
    // 该部分可能会变：
    data: value,
    lastTime: curTime,
    maxAge: maxAge
  }))
}

LSUtils.getItemWithMaxAge = function (key) {
  var valueObj = JSON.parse(localStorage.getItem(key))
  if (!valueObj) { return }
  if (new Date().getTime() - Number(valueObj.lastTime) > valueObj.maxAge) {
    localStorage.removeItem(key)
    // return // 返回空
  } else {
    return valueObj.data
  }
}
export default LSUtils
