import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users.vue'
import Rights from '../components/Power/Rights.vue'
import Roles from '../components/Power/roles.vue'
import Cat from '../components/goods/cat.vue'
import Goods from '../components/goods/goods.vue'
import Params from '../components/goods/params.vue'
import Reports from '../components/Reports/reports.vue'
import Orders from '../components/Orders/orders.vue'


Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },

  {
    path: '/home', component: home,
    redirect: '/Welcome',
    children: [
      { path: '/Welcome', component: Welcome },
      { path: '/Users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cat },
      { path: '/goods', component: Goods },
      { path: '/categories', component: Cat },
      { path: '/params', component: Params },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports }
    ],
  },

]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
export default router
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next 是一个函数，代表放行
  //next() 放行   next('/login')跳转到
  if (to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login');
  } else {
    next()
  }

})
