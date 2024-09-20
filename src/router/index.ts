import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized
} from 'vue-router'
import Failed from '@/views/Failed.vue'
// import Mail from '@/components/mail/Mail.vue'
import Home from '@/views/Home.vue'
import { useAccountsStore } from '@/stores/accounts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/mail',
      name: 'mail',
      component: () => import('@/components/mail/MailView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/failed',
      name: 'Failed',
      component: Failed
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/' // redirect all other routes to the home page
    }
  ]
})

router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const accountsStore = useAccountsStore()
    console.log(
      `${from.fullPath} -> ${to.fullPath} ${to.meta?.requiresAuth ? 'requires authentication' : 'does not require authentication'}`
    )

    if (!to.meta?.requiresAuth) next()
    else if (accountsStore.isAuthenticated) next()
    else next('/failed')
  }
)

export default router
