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
  const selectedAccount: Ref<AccountInfo | undefined> = ref()

  // actions
  const login = async (): Promise<void> => {
    const request: PopupRequest = { redirectUri: msalConfig.auth.redirectUri, scopes: appConfig.loginScopes }
    msalPublicClient
      .loginPopup(request)
      .then((result: AuthenticationResult) => {
        msalPublicClient.setActiveAccount(result.account)
        selectedAccount.value = result.account
        console.log(`login success: ${selectedAccount.value}`)
      })
      .catch(err => {
        console.error('login failure', err)
        throw err
      })
  }

  const logout = async (): Promise<void> => {
    msalPublicClient
      .logoutPopup({ mainWindowRedirectUri: msalConfig.auth.postLogoutRedirectUri || undefined })
      .then(selectedAccount.value = undefined)
      .catch(err => {
        console.error('logout failure', err)
        throw err
      })
  }

  const selectAccount = (username: string): AccountInfo | undefined => {
    const account = accounts.value.find((account) => account.username === username)
    if (account) {
      msalPublicClient.setActiveAccount(account)
      selectedAccount.value = account
    }
    return account
  }

  const acquireToken = async (scopes = ['user.read']) => {
    const accessTokenRequest = {
      scopes,
      account: selectedAccount.value
    }

    let tokenResp
    try {
      // 1. Try to acquire token silently
      tokenResp = await msalPublicClient.acquireTokenSilent(accessTokenRequest)
      console.log('### MSAL acquireTokenSilent was successful')
    } catch (err) {
      // 2. Silent process might have failed so try via popup
      tokenResp = await msalPublicClient.acquireTokenPopup(accessTokenRequest)
      console.log('### MSAL acquireTokenPopup was successful')
    }

    // Just in case check, probably never triggers
    if (!tokenResp.accessToken) {
      throw new Error("### accessToken not found in response, that's bad")
    }

    return tokenResp.accessToken
  }

  // getters
  const accountsDetails: ComputedRef<Account[]> = computed(() => accounts.value.map(toAccount))
  const accountDetails: ComputedRef<Account | undefined> = computed(() => selectedAccount.value ? toAccount(selectedAccount.value) : undefined)
  const isAuthenticated: ComputedRef<boolean> = computed(() => !!selectedAccount.value)

  return {
    accounts,
    selectedAccount,
    login,
    logout,
    selectAccount,
    acquireToken,
    accountsDetails,
    accountDetails,
    isAuthenticated
  }
})
