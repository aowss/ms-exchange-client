import { computed, type ComputedRef, type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  deleteMail,
  getFolders,
  type GroupedFolders,
  type GroupedMessages, listFolders,
  listMessages,
  replyToMail
} from '@/lib/graphHelper'
import { useAccountsStore } from '@/stores/accounts'
import type { MailFolder, Message } from '@microsoft/microsoft-graph-types'

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
  const messages: Ref<GroupedMails> = ref({})
  const mailFolders: Ref<GroupedFolders> = ref({})
  const selectedFolder: Ref<string> = ref('Inbox')
  const selectedMailIds: Ref<GroupedMailIds> = ref({})
  const filter: Ref<string | undefined> = ref()

  const getMessages = async (): Promise<GroupedMails> => {
    const accessToken = await accountsStore.acquireToken(['mail.read'])
    const messagesList: GroupedMessages = await listMessages(accessToken)
    for (const [folderId, emails] of Object.entries(messagesList)) {
      const folderKey: string = Object.values(mailFolders.value)
        .find((folder: MailFolder) => folder.id === folderId)?.displayName || folderId
      messages.value[folderKey] = emails.map(toMail)
      selectedMailIds.value[folderKey] = messages.value[folderKey][0].id
    }
    return messages.value
  }

  const getGroupedMailFolders = async (): Promise<GroupedFolders> => {
    const accessToken = await accountsStore.acquireToken(['mail.read'])
    // Object.assign(mailFolders, await listFolders(accessToken))
    mailFolders.value = await listFolders(accessToken)
    return mailFolders.value;
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
    const messageId: string | undefined = selectedMailIds.value[folder]
    const selectedMail = messages.value[folder].find((mail: Mail) => mail.id === messageId)
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
    const messageId: string | undefined = selectedMailIds.value[folder]
    if (messageId) {
      await deleteMail(accessToken, messageId || '')
      await getMessages()
    }
  }

  const filterMailList = (search: string | undefined): Mail[] => {
    filter.value = search
    return filteredMailList.value[selectedFolder.value]
  }

  const selectMail = (folder: string, id: string | undefined): Mail | undefined => {
    if (folder && id && mailFolders.value[folder] && messages.value[folder]) {
      if (messages.value[folder].map((mail: Mail) => mail.id).includes(id)) {
        selectedMailIds.value[folder] = id
      }
    }
    return selectedMail.value
  }

  // getters
  const selectedMail: ComputedRef<Mail | undefined> = computed(
    () => {
      if (messages.value && selectedFolder.value && messages.value[selectedFolder.value]) {
        return messages.value[selectedFolder.value]?.find((message: Mail) => message.id === selectedMailIds.value[selectedFolder.value]) || messages.value[selectedFolder.value][0]
      }
      return undefined
    }
  )

  const getCounts = computed(() => {
    if (Object.keys(mailFolders.value).length === 0) return {}
    return Object.entries(mailFolders.value)
      .reduce((acc: GroupedMailIds, [name, details]) => {
        acc[name] = `${details.unreadItemCount} / ${details.totalItemCount}`
        return acc
      }, {})
  })

  // const filteredMailList: ComputedRef<Mail[]> = computed(() => {
  //   if (!filter.value || filter.value.trim().length === 0) return mails.value
  //   return mails.value.filter(
  //     (item) =>
  //       item.name?.includes(<string>filter.value) ||
  //       item.email?.includes(<string>filter.value) ||
  //       item.name?.includes(<string>filter.value) ||
  //       item.subject?.includes(<string>filter.value) ||
  //       item.text?.includes(<string>filter.value)
  //   )
  // })

  const filteredMailList: ComputedRef<GroupedMails> = computed(() => {
    if (!filter.value || filter.value.trim().length === 0) return messages.value
    for (const [folderId, emails] of Object.entries(messages.value)) {
      const folderKey = Object.values(mailFolders.value)
        .find((folder: MailFolder) => folder.id === folder)?.displayName || folderId
      messages.value[folderKey] = emails.map(toMail)
      selectedMailIds.value[folderKey] = messages.value[folderKey][0].id
    }
    const list = Object.entries(messages.value)
      .reduce((acc: GroupedMails, [folder, emails]) => {
        acc[folder] = emails.filter(
          (item: Mail) =>
            item.name?.includes(<string>filter.value) ||
            item.email?.includes(<string>filter.value) ||
            item.name?.includes(<string>filter.value) ||
            item.subject?.includes(<string>filter.value) ||
            item.text?.includes(<string>filter.value)
        )
        return acc
      }, {})
    return list
  })

  // const unreadMailList: ComputedRef<Mail[]> = computed(() =>
  //   filteredMailList.value.filter((item) => !item.read)
  // )

  const unreadMailList: ComputedRef<GroupedMails> = computed(() =>
    Object.entries(filteredMailList.value)
      .reduce((acc: GroupedMails, [folder, emails]) => {
        acc[folder] = emails.filter((item) => !item.read)
        return acc
      }, {})
  )

  return {
    messages,
    mailFolders,
    selectedFolder,
    selectedMailIds,
    filter,
    getMessages,
    getMailFolders,
    getCounts,
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
