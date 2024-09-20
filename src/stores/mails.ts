import { computed, type ComputedRef, type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import { getInbox } from '@/lib/graphHelper'
import { Client, type PageCollection } from '@microsoft/microsoft-graph-client'
import { useAccountsStore } from '@/stores/accounts'

export interface Mail {
  id: string
  name: string
  email: string
  subject: string
  text: string
  date: string
  read: boolean
  labels: string[]
}

const toMail = (page: PageCollection): Mail[] =>
  page.value.map((mail) => ({
    id: mail.id,
    name: mail.sender.emailAddress.name,
    email: mail.sender.emailAddress.address,
    subject: mail.subject,
    text: mail.body.content,
    date: mail.sentDateTime,
    read: mail.isRead,
    labels: mail.categories
  }))

const accountsStore = useAccountsStore()

export const useMailsStore = defineStore('mails', () => {
  console.log('useMailsStore')

  // state
  const mails: Ref<Mail[]> = ref([])
  const selectedMailId: Ref<string | undefined> = ref()
  const filter: Ref<string | undefined> = ref()

  // actions
  const getMail = async () => {
    const accessToken = await accountsStore.acquireToken()
    console.log('accessToken', accessToken)
    const result = await getInbox(accessToken).then(toMail)
    if (result) {
      mails.value = result
      selectedMailId.value = mails.value[0].id
    }
    return mails.value // returning the state
  }

  const filterMailList = (search: string | undefined): Mail[] => {
    filter.value = search
    return filteredMailList.value // returning the state
  }

  const selectMail = (id: string | undefined) => {
    if (id && mails.value.map((mail) => mail.id).includes(id)) selectedMailId.value = id
    return selectedMail.value // returning the state
  }

  // getters
  const selectedMail: ComputedRef<Mail> = computed(
    () => mails.value.find((mail) => mail.id === selectedMailId.value) || mails.value[0]
  )
  const filteredMailList: ComputedRef<Mail[]> = computed(() => {
    if (!filter.value || filter.value.trim().length === 0) return mails.value
    return mails.value.filter(
      (item) =>
        item.name.includes(<string>filter.value) ||
        item.email.includes(<string>filter.value) ||
        item.name.includes(<string>filter.value) ||
        item.subject.includes(<string>filter.value) ||
        item.text.includes(<string>filter.value)
    )
  })
  const unreadMailList: ComputedRef<Mail[]> = computed(() =>
    filteredMailList.value.filter((item) => !item.read)
  )

  return {
    mails,
    selectedMailId,
    filter,
    getMail,
    selectMail,
    filterMailList,
    selectedMail,
    unreadMailList,
    filteredMailList
  }
})
