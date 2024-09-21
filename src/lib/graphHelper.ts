import 'isomorphic-fetch'
import { Client, type PageCollection } from '@microsoft/microsoft-graph-client'
import type { Message, User } from '@microsoft/microsoft-graph-types'
import type { EMailAddress } from '@/stores/mails'

const GRAPH_URL = 'https://graph.microsoft.com/v1.0'
const URL_USER = 'me'
const URL_SEND_MAIL = 'me/sendMail'
const URL_INBOX_MESSAGES = 'me/mailFolders/inbox/messages'
const URL_REPLY = 'me/messages/{id}/reply'

export const sendMail = async (
  graphClient: Client,
  subject: string,
  body: string,
  recipients: string[]
) => {
  if (!graphClient) throw new Error('Graph has not been initialized for user auth')
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

  return graphClient.api(URL_SEND_MAIL).post({ message: message })
}

export const getUser = async (
  graphClient: Client,
  properties: string[] = ['displayName', 'mail', 'userPrincipalName']
): Promise<User> => {
  if (!graphClient) throw new Error('Graph has not been initialized for user auth')

  return graphClient.api(URL_USER).select(properties).get()
}

export const getInbox = async (
  accessToken: string,
  properties: string[] = ['from', 'isRead', 'receivedDateTime', 'subject'],
  limit: number = 25
): Promise<PageCollection> => {
  return callAPI('List messages', URL_INBOX_MESSAGES, 'GET', accessToken)
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

async function callAPI(
  name: string,
  URL: string,
  method: string,
  accessToken: string,
  body?: object
) {
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

  const json = await response.json()
  console.log(json)
  return json
}
