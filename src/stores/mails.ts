import { computed, type ComputedRef, reactive, type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import { deleteMail, getFolders, getInbox, type GroupedMessages, listMessages, replyToMail } from '@/lib/graphHelper'
import { useAccountsStore } from '@/stores/accounts'
import type { Message } from '@microsoft/microsoft-graph-types'

export interface EMailAddress {
  emailAddress?: {
    name?: string
    address?: string
  }
}

export interface Mail {
  id?: string
  name?: string
  email?: string
  subject?: string
  text?: string
  date?: string
  read?: boolean
  labels?: string[]
  replyTo?: EMailAddress[]
  from?: EMailAddress
}

export interface GroupedMails {
  [key: string]: Mail[]
}

export interface GroupedMailIds {
  [key: string]: string | undefined
}

const toMail = (mail: Message): Mail => ({
  id: mail.id,
  name: mail.sender?.emailAddress?.name || undefined,
  email: mail.sender?.emailAddress?.address || undefined,
  subject: mail.subject || undefined,
  text: mail.body?.content || undefined,
  date: mail.sentDateTime || undefined,
  read: mail.isRead || undefined,
  labels: mail.categories || [],
  replyTo: <EMailAddress[]>mail.replyTo || undefined,
  from: <EMailAddress>mail.from || undefined
})

const accountsStore = useAccountsStore()

export const useMailsStore = defineStore('mails', () => {
  // state
  const mails: Ref<Mail[]> = ref([])
  const selectedMailId: Ref<string | undefined> = ref()
  const messages: Ref<GroupedMails> = ref({})
  const selectedMailIds: Ref<GroupedMailIds> = ref({})
  const filter: Ref<string | undefined> = ref()

  // actions
  const getMail = async (): Promise<Mail[]> => {
    const accessToken = await accountsStore.acquireToken(['mail.read'])
    const result: Mail[] = await getInbox(accessToken).then((emails) => emails.value.map(toMail))
    if (result) {
      mails.value = result
      selectedMailId.value = mails.value[0].id
    }
    return mails.value // returning the state
  }

  const getMessages = async (): Promise<GroupedMails> => {
    const accessToken = await accountsStore.acquireToken(['mail.read'])
    const messagesList: GroupedMessages = await listMessages(accessToken)
    for (const [folder, emails] of Object.entries(messagesList)) {
      messages.value[folder] = emails.map(toMail)
      selectedMailIds.value[folder] = messages.value[folder][0].id
    }
    return messages.value // returning the state
  }

  const getMailFolders = async () => {
    const accessToken = await accountsStore.acquireToken(['mail.read'])
    return getFolders(accessToken)
  }

  const reply = async (body: string) => {
    const accessToken = await accountsStore.acquireToken(['mail.send'])
    const messageId = selectedMail.value.id
    // From the doc: If the original message specifies a recipient in the 'replyTo' property, use it.
    const recipients: EMailAddress[]=
      selectedMail.value.replyTo && selectedMail.value.replyTo.length !== 0
        ? selectedMail.value.replyTo.filter(value => value) as EMailAddress[]
        : [selectedMail.value.from].filter(value => value) as EMailAddress[]
    if (recipients) return replyToMail(accessToken, messageId || '', body, recipients)
  }

  const deleteSelectedMail = async () => {
    const accessToken = await accountsStore.acquireToken(['mail.readwrite'])
    const messageId = selectedMail.value.id
    await deleteMail(accessToken, messageId || '')
    await getMessages()
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
        item.name?.includes(<string>filter.value) ||
        item.email?.includes(<string>filter.value) ||
        item.name?.includes(<string>filter.value) ||
        item.subject?.includes(<string>filter.value) ||
        item.text?.includes(<string>filter.value)
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
    getMailFolders,
    reply,
    deleteSelectedMail,
    selectMail,
    filterMailList,
    selectedMail,
    unreadMailList,
    filteredMailList
  }
})
