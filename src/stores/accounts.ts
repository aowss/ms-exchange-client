import { computed, type ComputedRef, type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import { appConfig, msalConfig } from '@/config'
import { msalPublicClient } from '@/lib/clients'
import { type AccountInfo, type AuthenticationResult, type PopupRequest } from '@azure/msal-browser'
import { getPhoto, getProfile } from '@/lib/graphHelper'
import { blobToBase64 } from '@/lib/utils'

export interface Account {
  name: string
  email: string
}

const toAccount = (info: AccountInfo): Account => ({
  name: info.name || info.username,
  email: info.username
})

export interface Address {
  label: string
  type: string
  postOfficeBox: string
  street: string
  city: string
  state: string
  countryOrRegion: string
  postalCode: string
}

const toAddress = (address: any): Address => ({
  label: address.displayName || '',
  type: address.type || '',
  postOfficeBox: address.postOfficeBox || '',
  street: address.street || '',
  city: address.city || '',
  state: address.state || '',
  countryOrRegion: address.countryOrRegion || '',
  postalCode: address.postalCode || ''
})

export interface Phone {
  label: string
  type: string
  number: string
}

const toPhone = (phone: any): Phone => ({
  label: phone.displayName || '',
  type: phone.type || '',
  number: phone.number || ''
})

export interface Position {
  jobTitle: string
  role: string
  department: string
  company: {
    name: string
    address: Address
  }
  manager: Account
}

const toPosition = (position: any): Position => ({
  jobTitle: position.detail.jobTitle || '',
  role: position.detail.role || '',
  department: position.detail.company?.department || '',
  company: {
    name: position.detail.company?.displayName || '',
    address: toAddress(position.detail.company?.address)
  },
  manager: {
    name: position.manager?.displayName || '',
    email: position.manager?.userPrincipalName || ''
  }
})

export interface ProfileInfo {
  addresses?: Address[]
  phones?: Phone[]
  position?: Position
}

const toProfile = (profile: any): ProfileInfo => ({
  addresses: profile.addresses?.map(toAddress),
  phones: profile.phones?.map(toPhone),
  position: toPosition(profile.positions[0])
})

export const useAccountsStore = defineStore('accounts', () => {
  // state
  const accounts: Ref<AccountInfo[]> = ref([])
  const selectedAccount: Ref<AccountInfo | undefined> = ref()
  const picture: Ref<string | undefined> = ref()
  const profile: Ref<ProfileInfo | undefined> = ref()

  // actions
  const login = async (): Promise<void> => {
    const request: PopupRequest = {
      redirectUri: msalConfig.auth.redirectUri,
      scopes: appConfig.loginScopes
    }
    msalPublicClient
      .loginPopup(request)
      .then((result: AuthenticationResult) => {
        accounts.value = msalPublicClient.getAllAccounts()
        msalPublicClient.setActiveAccount(result.account)
        selectedAccount.value = result.account
      })
      .catch((err) => {
        console.error('login failure', err)
        throw err
      })
  }

  const logout = async (): Promise<void> => {
    msalPublicClient
      .logoutPopup({ mainWindowRedirectUri: msalConfig.auth.postLogoutRedirectUri || undefined })
      .then(() => {
        selectedAccount.value = undefined
        accounts.value = []
      })
      .catch((err) => {
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

  const acquireToken = async (scopes = appConfig.graphScopes) => {
    const accessTokenRequest = {
      scopes,
      account: selectedAccount.value
    }

    let tokenResp
    try {
      // 1. Try to acquire token silently
      tokenResp = await msalPublicClient.acquireTokenSilent(accessTokenRequest)
      console.log('MSAL acquireTokenSilent was successful')
    } catch (err) {
      // 2. Silent process might have failed so try via popup
      tokenResp = await msalPublicClient.acquireTokenPopup(accessTokenRequest)
      console.log('MSAL acquireTokenPopup was successful')
    }

    // Just in case check, probably never triggers
    if (!tokenResp.accessToken) {
      throw new Error('accessToken not found in response')
    }

    return tokenResp.accessToken
  }

  const getPicture = async () => {
    if (!picture.value) {
      const accessToken = await acquireToken(['user.read'])
      const blob = await getPhoto(accessToken)
      picture.value = await blobToBase64(blob)
    }
    return picture.value
  }

  const getUserProfile = async () => {
    if (!profile.value) {
      const accessToken = await acquireToken(['user.read'])
      profile.value = toProfile(await getProfile(accessToken))
    }
    return profile.value
  }

  // getters
  const accountsDetails: ComputedRef<Account[]> = computed(() => accounts.value.map(toAccount))
  const accountDetails: ComputedRef<Account | undefined> = computed(() =>
    selectedAccount.value ? toAccount(selectedAccount.value) : undefined
  )
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
    picture,
    getPicture,
    profile,
    getUserProfile,
    isAuthenticated
  }
})
