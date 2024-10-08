import { type Configuration, LogLevel } from '@azure/msal-browser'

export interface AppConfiguration {
  clientId: string
  tenantId: string
  loginScopes: string[]
  graphScopes: string[]
}

// See https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md#dynamic-scopes-and-incremental-consent for details about static vs. dynamic scopes
export const appConfig: AppConfiguration = {
  clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
  tenantId: import.meta.env.VITE_MSAL_TENANT_ID,
  loginScopes: ['openid', 'profile', 'user.read'],
  graphScopes: ['mail.read', 'mail.send', 'mail.readwrite']
}

export const msalConfig: Configuration = {
  auth: {
    clientId: appConfig.clientId,
    authority: `https://login.microsoftonline.com/${appConfig.tenantId}`,
    redirectUri: window.location.origin, // Must be registered as a SPA redirectURI on your app registration
    postLogoutRedirectUri: '/' // Must be registered as a SPA redirectURI on your app registration
  },
  cache: {
    cacheLocation: 'localStorage'
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
        if (containsPii) {
          return
        }
        return
        switch (level) {
          case LogLevel.Error:
            console.error(message)
            return
          case LogLevel.Info:
            console.info(message)
            return
          case LogLevel.Verbose:
            console.debug(message)
            return
          case LogLevel.Warning:
            console.warn(message)
            return
          default:
            return
        }
      },
      logLevel: LogLevel.Verbose
    }
  }
}
