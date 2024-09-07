import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from '@/router'
import { msalPlugin } from '@/plugins/msalPlugin'
import { msalPublicClient } from '@/lib/clients'
import { type AuthenticationResult, EventType } from '@azure/msal-browser'
import { CustomNavigationClient } from '@/router/NavigationClient'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//  TODO: check if this is needed
// const navigationClient = new CustomNavigationClient(router);
// msalPublicClient.setNavigationClient(navigationClient);

msalPublicClient.addEventCallback((event) => {
  console.log('event', event)
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as AuthenticationResult
    const account = payload.account
    msalPublicClient.setActiveAccount(account)
  }
})

const app = createApp(App)

app.use(ElementPlus)
app.use(msalPlugin, msalPublicClient)
app.use(createPinia())
app.use(router)

router.isReady().then(() => {
  // Waiting for the router to be ready prevents race conditions when returning from a loginRedirect or acquireTokenRedirect
  app.mount('#app')
})
