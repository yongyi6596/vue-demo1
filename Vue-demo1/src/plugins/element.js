import Vue from 'vue'

import { Button,Card ,Row ,Col} from 'element-ui'
import { Form,FormItem ,BreadcrumbItem ,Select} from 'element-ui'
import { Input,Main ,Breadcrumb,Option} from 'element-ui'
import { Message ,Container ,Header, Aside ,Menu ,Submenu ,MenuItemGroup,MenuItem} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Option)
Vue.use(Select)
Vue.use(Row)
Vue.use(Col)



//绑定Vue实例，这样同过this.$message可以访问全局访问
Vue.prototype.$message = Message
