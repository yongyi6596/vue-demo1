import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import axios from 'axios'
// 将axios挂在在Vue的原型对象上
Vue.prototype.$http = axios
//配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
