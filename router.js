import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Login = () => import('~/pages/login').then(m => m.default || m)
const Dashboard = () => import('~/pages/dashboard').then(m => m.default || m)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [{
      path: '/',
      redirect: '/dashboard',  
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }]
  })
}
