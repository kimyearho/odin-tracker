import {createRouter, createWebHistory} from 'vue-router'

import MainRoute from '@/views/Main.vue'

const routes = [
  {
    path: '/', component: MainRoute
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes 
})

export default router