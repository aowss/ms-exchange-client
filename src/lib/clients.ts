import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from '@/config'

export const msalPublicClient: PublicClientApplication = new PublicClientApplication(msalConfig)
