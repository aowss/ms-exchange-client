import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'
import { registerGuard } from '@/router/Guard'
import Failed from '@/views/Failed.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: App,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/failed',
      name: 'Failed',
      component: Failed
    }
  ]
})

export default router

registerGuard(router);
