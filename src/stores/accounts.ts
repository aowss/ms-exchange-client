import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'

export interface Account {
  label: string,
  email: string,
  icon: string,
}

export const useAccountsStore = defineStore('accounts', () => {
  const accounts: Ref<Account[]> = ref([
    {
      label: 'Alicia Koch',
      email: 'alicia@example.com',
      icon: 'ion:logo-vercel',
    },
    {
      label: 'Alicia Koch',
      email: 'alicia@gmail.com',
      icon: 'mdi:google',
    },
    {
      label: 'Alicia Koch',
      email: 'alicia@me.com',
      icon: 'bx:bxl-gmail',
    },
  ])

  return { accounts }
})
