import babelpolyfill from 'babel-polyfill' // eslint-disable-line no-unused-vars
import Vue from 'vue'
import router from './router'

import app from './app.vue'

import { URLroot, optionsArr } from './meta.js'

import $ from 'jquery'

// 在 main.js 中添加了这两行代码之后，就能直接在组件的 methods 中使用 $ajax 命令
// 增加拦截功能后的axios:
import axios from './global-utils/interceptor.js'
axios.defaults.withCredentials = true
Vue.prototype.$ajax = axios

if (IS_DEV) {
  Vue.prototype.URLroot = '/api' // ajax根目录+本地调试的proxy
} else {
  Vue.prototype.URLroot = URLroot // ajax根目录
}

// 模仿原始的option元素的构成理念：
// text：每一个option元素里的text节点；value：每一个option元素的value属性。
Vue.prototype.optionsArr = optionsArr

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  // ...app等价于render:h => h(app)
  render: h => h(app)
})
