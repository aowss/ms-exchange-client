import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from '@/router'
import { msalPlugin } from '@/plugins/msalPlugin'
import { msalInstance } from '@/authConfig'
import { type AuthenticationResult, EventType } from '@azure/msal-browser'
import { CustomNavigationClient } from '@/router/NavigationClient'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const navigationClient = new CustomNavigationClient(router);
msalInstance.setNavigationClient(navigationClient);

// const accounts = msalInstance.getAllAccounts();
// console.log('accounts', accounts);
//
// if (accounts.length > 0) {
//   msalInstance.setActiveAccount(accounts[0]);
// }
msalInstance.addEventCallback((event) => {
  console.log('event', event);
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as AuthenticationResult;
    const account = payload.account;
    msalInstance.setActiveAccount(account);
  }
});

const app = createApp(App)

app.use(ElementPlus);
app.use(createPinia())
app.use(router)
app.use(msalPlugin, msalInstance);

router.isReady().then(() => {
  // Waiting for the router to be ready prevents race conditions when returning from a loginRedirect or acquireTokenRedirect
  app.mount('#app');
});
