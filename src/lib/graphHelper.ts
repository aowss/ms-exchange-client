import 'isomorphic-fetch';
import { Client, type PageCollection } from '@microsoft/microsoft-graph-client'
import { msalPublicClient } from '@/lib/clients'
import type { Message, User } from '@microsoft/microsoft-graph-types'
import { InteractionType, PublicClientApplication } from '@azure/msal-browser'
import {
  AuthCodeMSALBrowserAuthenticationProvider
} from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser'
import { appConfig } from '@/config/config'

const URL_USER = '/me'
const URL_SEND_MAIL = 'me/sendMail'
const URL_INBOX_MESSAGES = '/me/mailFolders/inbox/messages'

export const getGraphClient = async (pca: PublicClientApplication, graphScopes: string[]) => {
  console.log("getGraphClient", pca, graphScopes)
  await pca.initialize()
  // Authenticate to get the user's account
  const authResult = await pca.acquireTokenPopup({
    scopes: ['User.Read'],
  });

  if (!authResult.account) {
    throw new Error('Could not authenticate');
  }

  const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(pca, {
    account: authResult.account,
    interactionType: InteractionType.Popup,
    scopes: graphScopes,
  });

  return Client.initWithMiddleware({ authProvider: authProvider })
}

const graphClient = await getGraphClient(msalPublicClient, appConfig.scopes)

export const sendMail = async (subject: string, body: string, recipients: string[]) => {
  if (!graphClient) throw new Error('Graph has not been initialized for user auth');
  if (!subject || subject.trim().length === 0) throw new Error("Subject is mandatory")
  if (!body || body.trim().length === 0) throw new Error("Body is mandatory")
  if (!recipients || recipients.length === 0 || recipients.filter(recipient => recipient.trim().length !== 0).length === 0) throw new Error("At least one recipient is mandatory")

  const message: Message = {
    subject: subject,
    body: {
      content: body,
      contentType: 'text'
    },
    toRecipients: recipients
      .filter(recipient => recipient.trim().length !== 0)
      .map(recipient => ({ emailAddress: { address: recipient } }))
  };

  return graphClient
    .api(URL_SEND_MAIL)
    .post({ message: message });
}

export const getUser = async(properties: string[] = ['displayName', 'mail', 'userPrincipalName']): Promise<User> => {
  if (!graphClient) throw new Error('Graph has not been initialized for user auth');

  return graphClient
    .api(URL_USER)
    .select(properties)
    .get();
}

export const getInbox = async(properties: string[] = ['from', 'isRead', 'receivedDateTime', 'subject'], limit: number = 25): Promise<PageCollection> => {
  if (!graphClient) throw new Error('Graph has not been initialized for user auth');

  return graphClient
    .api(URL_INBOX_MESSAGES)
    // .select(properties)
    .top(limit)
    .orderby('receivedDateTime DESC')
    .get();
}
