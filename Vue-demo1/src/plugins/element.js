import Vue from 'vue'
import { Button, } from 'element-ui'
import { Form,FormItem } from 'element-ui'
import { Input } from 'element-ui'
import { Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//绑定Vue实例，这样同过this.$message可以访问全局访问
Vue.prototype.$message = Message
