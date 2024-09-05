import { computed, type ComputedRef, type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import { getInbox } from '@/lib/graphHelper'
import type { PageCollection } from '@microsoft/microsoft-graph-client'

export interface Mail {
  id: string,
  name: string,
  email: string,
  subject: string,
  text: string,
  date: string,
  read: boolean,
  labels: string[]
}

const toMail = (page: PageCollection): Mail[] => page.value
  .map(mail => ({
    id: mail.id,
    name: mail.sender.emailAddress.name,
    email: mail.sender.emailAddress.address,
    subject: mail.subject,
    text: mail.body.content,
    date: mail.sentDateTime,
    read: mail.isRead,
    labels: mail.categories
  }))

export const useMailsStore = defineStore('mails', () => {
  console.log('useMailsStore')
  // state
  const mails: Ref<Mail[]> = ref([])

  // actions
  async function getMail() {
    console.log('getMail')
    mails.value = await getInbox().then(toMail)
    console.log('mails', mails.value)
  }

  const filteredMailList = (search: string): Mail[] => {
    console.log('search', search)
    if (!search || search.trim().length === 0) return mails.value
    return mails.value.filter((item) => {
      return item.name.includes(search)
        || item.email.includes(search)
        || item.name.includes(search)
        || item.subject.includes(search)
        || item.text.includes(search)
    })
  }

  const selectedMailData = (id: string | undefined): Mail | undefined => mails.value.find((mail) => mail.id === id) || mails.value[0]

  // getters
  const unreadMailList: ComputedRef<Mail[]> = computed(() => mails.value.filter(item => !item.read))

  return { mails, getMail, filteredMailList, selectedMailData, unreadMailList }
})
