import { computed, type ComputedRef, type Reactive, reactive, type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  deleteMail,
  getFolders,
  getInbox,
  type GroupedFolders,
  type GroupedMessages, listFolders,
  listMessages,
  replyToMail
} from '@/lib/graphHelper'
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
  const messages: Reactive<GroupedMails> = reactive({})
  const mailFolders: Reactive<GroupedFolders> = reactive({})
  const selectedMailIds: Reactive<GroupedMailIds> = reactive({})
  const filter: Ref<string | undefined> = ref()

  // actions
  const getMail = async (): Promise<Mail[]> => {
    const accessToken = await accountsStore.acquireToken(['mail.read'])
    const result: Mail[] = await getInbox(accessToken).then((emails) => emails.value.map(toMail))
    if (result) {
      mails.value = result
      selectedMailId.value = mails.value[0].id
    }
    return mails.value
  }

  const getMessages = async (): Promise<GroupedMails> => {
    const accessToken = await accountsStore.acquireToken(['mail.read'])
    const messagesList: GroupedMessages = await listMessages(accessToken)
    for (const [folderId, emails] of Object.entries(messagesList)) {
      const folderKey = Object.values(mailFolders)
        .find((folder) => folder.id === folder)?.displayName || folderId
      messages[folderKey] = emails.map(toMail)
      selectedMailIds[folderKey] = messages[folderKey][0].id
    }
    return messages
  }

  const getGroupedMailFolders = async (): Promise<GroupedFolders> => {
    console.log('getMailFolders')
    const accessToken = await accountsStore.acquireToken(['mail.read'])
    mailFolders.value = await listFolders(accessToken)
    console.log('mail folders', JSON.stringify(mailFolders.value))
    return mailFolders;
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

  const replyV2 = async (folder: string, body: string) => {
    const accessToken = await accountsStore.acquireToken(['mail.send'])
    const messageId: string | undefined = selectedMailIds[folder]
    const selectedMail = messages[folder].find((mail: Mail) => mail.id === messageId)
    if (selectedMail) {
      // From the doc: If the original message specifies a recipient in the 'replyTo' property, use it.
      const recipients: EMailAddress[] =
        selectedMail.replyTo && selectedMail.replyTo.length !== 0
          ? selectedMail.replyTo.filter(value => value) as EMailAddress[]
          : [selectedMail.from].filter(value => value) as EMailAddress[]
      if (recipients) return replyToMail(accessToken, messageId || '', body, recipients)
    }
  }

  const deleteSelectedMailV2 = async (folder: string) => {
    const accessToken = await accountsStore.acquireToken(['mail.readwrite'])
    const messageId: string | undefined = selectedMailIds[folder]
    if (messageId) {
      await deleteMail(accessToken, messageId || '')
      await getMessages()
    }
  }

  const filterMailList = (search: string | undefined): Mail[] => {
    filter.value = search
    return filteredMailList.value
  }

  const selectMail = (id: string | undefined) => {
    if (id && mails.value.map((mail) => mail.id).includes(id)) selectedMailId.value = id
    return selectedMail.value
  }

  const selectMailV2 = (folder: string, id: string | undefined): Mail | undefined => {
    if (folder && id && mailFolders[folder] && messages[folder]) {
      if (messages[folder].map((mail: Mail) => mail.id).includes(id)) selectedMailIds[folder] = id
    }
    return messages[folder].find((mail: Mail) => mail.id === id)
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

  const filteredMailListV2: ComputedRef<GroupedMails> = computed(() => {
    console.log('filteredMailList', filter.value)
    if (!filter.value || filter.value.trim().length === 0) return messages.value
    for (const [folderId, emails] of Object.entries(messages)) {
      const folderKey = Object.values(mailFolders)
        .find((folder) => folder.id === folder)?.displayName || folderId
      messages[folderKey] = emails.map(toMail)
      selectedMailIds[folderKey] = messages[folderKey][0].id
    }
    const list = Object.entries(messages)
      .reduce((acc: GroupedMails, [folder, emails]) => {
        acc[folder] = emails.filter(
          (item) =>
            item.name?.includes(<string>filter.value) ||
            item.email?.includes(<string>filter.value) ||
            item.name?.includes(<string>filter.value) ||
            item.subject?.includes(<string>filter.value) ||
            item.text?.includes(<string>filter.value)
        )
        return acc
      }, {})
    console.log('filtered mail list', JSON.stringify(list))
    return list
  })

  const unreadMailList: ComputedRef<Mail[]> = computed(() =>
    filteredMailList.value.filter((item) => !item.read)
  )

  const unreadMailListV2: ComputedRef<GroupedMails> = computed(() =>
    Object.entries(filteredMailListV2.value)
      .reduce((acc: GroupedMails, [folder, emails]) => {
        acc[folder] = emails.filter((item) => !item.read)
        return acc
      }, {})
  )

  return {
    mails,
    selectedMailId,
    mailFolders,
    filter,
    getMail,
    getMailFolders,
    getGroupedMailFolders,
    reply,
    deleteSelectedMail,
    selectMail,
    filterMailList,
    selectedMail,
    unreadMailList,
    filteredMailList
  }
})
