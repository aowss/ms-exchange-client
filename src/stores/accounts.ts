import { computed, type ComputedRef, type Ref, ref } from 'vue'
import { defineStore } from 'pinia'

import { msalPublicClient } from '@/lib/clients'
import { type AccountInfo, type AuthenticationResult, EventType } from '@azure/msal-browser'

export interface Account {
  label: string
  email: string
  icon?: string
}

const toAccount = (info: AccountInfo): Account => ({
  label: info.name || info.username,
  email: info.username
})

export const useAccountsStore = defineStore('accounts', () => {
  // state
  const accounts: Ref<AccountInfo[]> = ref(msalPublicClient.getAllAccounts())
  const selectedAccount: Ref<AccountInfo> = ref(accounts.value[0])

  // actions
  const selectAccount = (username: string): AccountInfo | undefined => {
    const account = accounts.value.find((account) => account.username === username)
    if (account) {
      msalPublicClient.setActiveAccount(account)
      selectedAccount.value = account
    }
    return account
  }

  // getters
  const accountsDetails: ComputedRef<Account[]> = computed(() => accounts.value.map(toAccount))
  const accountDetails: ComputedRef<Account> = computed(() => toAccount(selectedAccount.value))

  // msalPublicClient.addEventCallback((event) => {
  //   console.log('event', event);
  //   if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
  //     const payload = event.payload as AuthenticationResult;
  //     const account = payload.account;
  //     msalPublicClient.setActiveAccount(account);
  //   }
  // });

  return { accounts, selectedAccount, selectAccount, accountsDetails, accountDetails }
})
