import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/preventivo',
    name: 'Preventivo',
    component: () => import('../views/Preventivo.vue')
  },
  {
    path: '/reporteservicio',
    name: 'ReporteServicio',
    component: () => import('../views/ReporteServicio.vue')
  },
  {
    path: '/bitacorapreventivo',
    name: 'BitacoraPreventivo',
    component: () => import('../views/BitacoraPreventivo.vue')
  },
  {
    path: '/calendario',
    name: 'Calendario',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Calendario.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
