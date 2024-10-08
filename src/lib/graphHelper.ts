import 'isomorphic-fetch'
import { type PageCollection } from '@microsoft/microsoft-graph-client'
import type { Folder, MailFolder, Message, User } from '@microsoft/microsoft-graph-types'
import type { EMailAddress } from '@/stores/mails'

const GRAPH_URL = 'https://graph.microsoft.com/v1.0'
const URL_USER = 'me'
const URL_SEND_MAIL = 'me/sendMail'
const URL_FOLDERS = 'me/mailFolders'
const URL_INBOX_MESSAGES = `${URL_FOLDERS}/inbox/messages`
const URL_MESSAGES = 'me/messages'
const URL_MESSAGE = `${URL_MESSAGES}/{id}`
const URL_REPLY = `${URL_MESSAGE}/reply`

export const sendMail = async (
  accessToken: string,
  subject: string,
  body: string,
  recipients: string[]
) => {
  if (!subject || subject.trim().length === 0) throw new Error('Subject is mandatory')
  if (!body || body.trim().length === 0) throw new Error('Body is mandatory')
  if (
    !recipients ||
    recipients.length === 0 ||
    recipients.filter((recipient) => recipient.trim().length !== 0).length === 0
  )
    throw new Error('At least one recipient is mandatory')

  const message: Message = {
    subject: subject,
    body: {
      content: body,
      contentType: 'text'
    },
    toRecipients: recipients
      .filter((recipient) => recipient.trim().length !== 0)
      .map((recipient) => ({ emailAddress: { address: recipient } }))
  }

  return callAPI('Send Mail', URL_SEND_MAIL, 'POST', accessToken, message)
}

export const getUser = async (accessToken: string): Promise<User> =>
  callAPI('Get User', URL_USER, 'GET', accessToken)

export const getInbox = async (accessToken: string): Promise<PageCollection> =>
  callAPI('List Inbox messages', URL_INBOX_MESSAGES, 'GET', accessToken)

/**
 * The key is the folder's id
 */
export interface GroupedMessages {
  [key: string]: Message[]
}

/**
 * The key is the folder's display name
 */
export interface GroupedFolders {
  [key: string]: MailFolder
}

export const listFolders = async (accessToken: string): Promise<GroupedFolders> => {
  const folders = await callAPI('List folders', URL_FOLDERS, 'GET', accessToken)
  return folders.value.reduce((acc: GroupedFolders, folder: MailFolder) => {
    const name = folder.displayName
    if (name) acc[name] = folder
    return acc
  }, {})
}

export const getFolders = async (accessToken: string): Promise<Folder> =>
  callAPI('List folders', URL_FOLDERS, 'GET', accessToken)

export const listMessages = async (accessToken: string): Promise<GroupedMessages> => {
  const messages = await callAPI('List messages', URL_MESSAGES, 'GET', accessToken)
  const messagesPerFolder = messages.value.reduce((acc: GroupedMessages, message: Message) => {
    const folder = message.parentFolderId
    if (folder) {
      if (!acc[folder]) acc[folder] = []
      acc[folder].push(message)
    }
    return acc
  }, {})
  return messagesPerFolder
}

export const replyToMail = async (
  accessToken: string,
  id: string,
  body: string,
  recipients: EMailAddress[]
) => {
  if (!body || body.trim().length === 0) throw new Error('Body is mandatory')

  const reply = {
    message: {
      toRecipients: recipients
    },
    comment: body
  }

  return callAPI('Reply', URL_REPLY.replace('{id}', id), 'POST', accessToken, reply)
}

export const deleteMail = async (accessToken: string, id: string): Promise<void> =>
  callAPI('Delete', URL_MESSAGE.replace('{id}', id), 'DELETE', accessToken)

const callAPI = async (
  name: string,
  URL: string,
  method: string,
  accessToken: string,
  body?: object
) => {
  const response = await fetch(`${GRAPH_URL}/${URL}`, {
    method: method,
    body: body ? JSON.stringify(body) : null,
    headers: {
      authorization: `bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Error while calling ${name}: status: ${response.status}`)
  }

  if (isJson(response)) return response.json()
}

const isJson = (response: Response) =>
  response.headers.get('Content-Type')?.includes('application/json')
