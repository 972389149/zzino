var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})
// 最终全文件相当于：
// module.exports = {
//   NODE_ENV: '"development"'
// }