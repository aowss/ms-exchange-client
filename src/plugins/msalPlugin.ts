import { type App, type Reactive, reactive } from 'vue'
import {
  type EventMessage,
  EventMessageUtils,
  EventType,
  InteractionStatus,
  PublicClientApplication,
  type AccountInfo
} from '@azure/msal-browser'

type AccountIdentifiers = Partial<Pick<AccountInfo, "homeAccountId"|"localAccountId"|"username">>;

/**
 * Helper function to determine whether 2 arrays are equal
 * Used to avoid unnecessary state updates
 * @param arrayA
 * @param arrayB
 */
function accountArraysAreEqual(arrayA: Array<AccountIdentifiers>, arrayB: Array<AccountIdentifiers>): boolean {
  if (arrayA.length !== arrayB.length) {
    return false;
  }

  const comparisonArray = [...arrayB];

  return arrayA.every((elementA) => {
    const elementB = comparisonArray.shift();
    if (!elementA || !elementB) {
      return false;
    }

    return (elementA.homeAccountId === elementB.homeAccountId) &&
      (elementA.localAccountId === elementB.localAccountId) &&
      (elementA.username === elementB.username);
  });
}

export interface State {
  instance: PublicClientApplication,
  status: InteractionStatus,
  accounts: AccountInfo[],
  selectedAccount: AccountInfo | null
}

export const msalPlugin = {
  install: (app: App, msalInstance: PublicClientApplication) => {
    const state: Reactive<State> = reactive({
      instance: msalInstance,
      status: InteractionStatus.Startup,
      accounts: msalInstance.getAllAccounts(),
      selectedAccount: msalInstance.getActiveAccount()
    })

    app.config.globalProperties.$msal = state

    msalInstance.addEventCallback((message: EventMessage) => {
      console.log('message', message)

      switch (message.eventType) {
        case EventType.ACCOUNT_ADDED:
        case EventType.ACCOUNT_REMOVED:
        case EventType.LOGIN_SUCCESS:
        case EventType.SSO_SILENT_SUCCESS:
        case EventType.HANDLE_REDIRECT_END:
        case EventType.LOGIN_FAILURE:
        case EventType.SSO_SILENT_FAILURE:
        case EventType.LOGOUT_END:
        case EventType.ACQUIRE_TOKEN_SUCCESS:
        case EventType.ACQUIRE_TOKEN_FAILURE: {
          const currentAccounts = msalInstance.getAllAccounts()
          if (!accountArraysAreEqual(currentAccounts, state.accounts)) {
            state.accounts = currentAccounts
          }
          break
        }
      }

      const status = EventMessageUtils.getInteractionStatusFromEvent(message, state.inProgress)
      /*
            if (status !== null) {
                //  TODO: check this
                state.inProgress = status;
            }
            */
    })
  }
}
