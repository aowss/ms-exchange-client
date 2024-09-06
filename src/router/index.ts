import { createRouter, createWebHistory } from 'vue-router'
import { registerGuard } from '@/router/Guard'
import Failed from '@/views/Failed.vue'
import Mail from '@/components/mail/Mail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/mail',
      name: 'mail',
      component: Mail,
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
