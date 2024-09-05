import { computed, type ComputedRef, type Ref, ref } from 'vue'
import { defineStore } from 'pinia'

import { msalInstance } from '@/config/authConfig'
import { type AccountInfo, type AuthenticationResult, EventType } from '@azure/msal-browser'

export interface Account {
  label: string,
  email: string,
  icon?: string,
}

const toAccount = (info: AccountInfo): Account => ({
  label: info.name || info.username,
  email: info.username
})

export const useAccountsStore = defineStore('accounts', () => {
  // state
  const accounts: Ref<AccountInfo[]> = ref(msalInstance.getAllAccounts());
  const selectedAccount: Ref<AccountInfo> = ref(accounts.value[0]);

  // actions
  const selectAccount = (username: string): AccountInfo | undefined => {
    const account = accounts.value.find(account => account.username === username)
    if (account) {
      msalInstance.setActiveAccount(account);
      selectedAccount.value = account;
    }
    return account
  }

  // getters
  const accountsDetails: ComputedRef<Account[]> = computed(() => accounts.value.map(toAccount));
  const accountDetails: ComputedRef<Account> = computed(() => toAccount(selectedAccount.value));

  // msalInstance.addEventCallback((event) => {
  //   console.log('event', event);
  //   if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
  //     const payload = event.payload as AuthenticationResult;
  //     const account = payload.account;
  //     msalInstance.setActiveAccount(account);
  //   }
  // });

  return { accounts, selectedAccount, selectAccount, accountsDetails, accountDetails }
})
