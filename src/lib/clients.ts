import { InteractionType, PublicClientApplication } from '@azure/msal-browser'
import { msalConfig, appConfig } from '@/config/config'
import { Client } from '@microsoft/microsoft-graph-client'
import {
  AuthCodeMSALBrowserAuthenticationProvider
} from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser'

console.log("config", msalConfig)
export const msalPublicClient: PublicClientApplication = new PublicClientApplication(msalConfig);
console.log("msalPublicClient", msalPublicClient);

// export const getGraphClient = async (pca: PublicClientApplication, graphScopes: string[]) => {
//   console.log("getGraphClient", pca, graphScopes)
//   // Authenticate to get the user's account
//   const authResult = await pca.acquireTokenPopup({
//     scopes: ['User.Read'],
//   });
//
//   if (!authResult.account) {
//     throw new Error('Could not authenticate');
//   }
//
//   const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(pca, {
//     account: authResult.account,
//     interactionType: InteractionType.Popup,
//     scopes: graphScopes,
//   });
//
//   return Client.initWithMiddleware({ authProvider: authProvider })
// }
//
// export const graphClient = await getGraphClient(msalPublicClient, appConfig.scopes)
