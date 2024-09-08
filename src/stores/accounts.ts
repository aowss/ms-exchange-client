import { computed, type ComputedRef, type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import { appConfig, msalConfig } from '@/config'
import { msalPublicClient } from '@/lib/clients'
import { type AccountInfo, type AuthenticationResult, type PopupRequest } from '@azure/msal-browser'

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
  const selectedAccount: Ref<AccountInfo> = ref()

  // actions
  const login = async (): Promise<AccountInfo> => {
    const request: PopupRequest = { redirectUri: msalConfig.auth.redirectUri, scopes: appConfig.loginScopes }
    return msalPublicClient
      .loginPopup(request)
      .then((result: AuthenticationResult) => {
        msalPublicClient.setActiveAccount(result.account)
        selectedAccount.value = result.account
      })
  }

  const logout = async () => {
    msalPublicClient
      .logoutPopup({ mainWindowRedirectUri: msalConfig.auth.postLogoutRedirectUri })
      .then(selectedAccount.value = null)
  }

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
  const isAuthenticated: ComputedRef<boolean> = computed(() => !!selectedAccount.value)

  return {
    accounts,
    selectedAccount,
    login,
    logout,
    selectAccount,
    accountsDetails,
    accountDetails,
    isAuthenticated
  }
})
