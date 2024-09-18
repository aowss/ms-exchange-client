import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from '@/config'

// See https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md#option-2
export const msalPublicClient: PublicClientApplication = await PublicClientApplication.createPublicClientApplication(msalConfig) as PublicClientApplication;
