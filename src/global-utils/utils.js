// 这个util文件临时有用：
// get请求拼接参数：
export default function param (arr) {
  let url = ''
  for (var i = 0; i < arr.length; i++) {
    if (i % 2 === 0) {
      url += '&' + arr[i]
    } else {
      url += '=' + encodeURIComponent(arr[i])
    }
  }
  // 把拼接时用的第一个&删掉
  return url ? url.substring(1) : ''
}
