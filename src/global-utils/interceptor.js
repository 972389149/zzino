import axios from 'axios'
// 使用mock， 先注释掉下面代码：
// import router from '@/router'
// import LSUtils from '@/util/localStorageUtils.js'

// axios.default.timeout = 5000

// // axios请求响应
// axios.interceptors.request.use(request => {
//   // 判断现在是否仍有登录状态
//   if (!router.currentRoute.meta.requireLogin) {
//     return request
//   }
//   if (!LSUtils.getItemWithMaxAge('user')) {
//     var CancelToken = axios.CancelToken
//     var cancel

//     // 与此同时应该保留用户填写过的信息，提高用户体验
//     alert('信息已过期，请重新登录！！')
//     router.replace({
//       path: '/login',// 有斜杠很重要，代表是从根路径开始,否则有可能接着上一个/作为子路由
//       query: {
//         redirect: router.currentRoute.fullPath
//       }
//     })
//     // 取消该request：
//     return {
//       cancelToken: new CancelToken(function executor (c) {
//         // 这个executor 函数接受一个cancel function作为参数
//         cancel = c
//         cancel("信息已过期，请重新登录！！")
//       })}
//   }
//   return request
// }, err => {
//   console.error('在拦截request的时候出错')
//   return Promise.reject(err)
// })




// 以下代码应该不必使用：
// axios拦截响应
// axios.interceptors.response.use(response => {
//   // 以后端的checkLogin返回的json数据作为跳转依据
//   if (!response.data.session.user) {
//     router.replace({
//       path: 'create',
//       query: {
//         redirect: router.currentRoute.fullPath
//       }
//     })
//   }
//   return response
// }, err => {
//   console.error('在拦截response的时候出错')
//   return Promise.reject(err)
// })

export default axios
