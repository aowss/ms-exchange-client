import { type Configuration, LogLevel } from '@azure/msal-browser'

export interface AppConfiguration {
  clientId: string
  tenantId: string
  loginScopes: string[]
  graphScopes: string[]
}

export const appConfig: AppConfiguration = {
  clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
  tenantId: import.meta.env.VITE_MSAL_TENANT_ID,
  loginScopes: ['user.read'],
  graphScopes: ['user.read', 'mail.read', 'mail.send']
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
