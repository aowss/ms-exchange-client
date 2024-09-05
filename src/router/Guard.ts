import { type RouteLocationNormalized, type Router } from "vue-router";
import { msalInstance, loginRequest } from "../config/authConfig";
import { InteractionType, type PopupRequest, PublicClientApplication, type RedirectRequest } from "@azure/msal-browser";

export function registerGuard(router: Router) {
    router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
        console.log(`${from.fullPath} -> ${to.fullPath}`)
        if (to.meta.requiresAuth) {
            const request = {
                ...loginRequest,
                redirectStartPage: to.fullPath
            }
            const shouldProceed = await isAuthenticated(msalInstance, InteractionType.Redirect, request);
            return shouldProceed || '/failed';
        }
        console.log('does not require authentication')
        return true;
    });
}

export async function isAuthenticated(instance: PublicClientApplication, interactionType: InteractionType, loginRequest: PopupRequest|RedirectRequest): Promise<boolean> {
    // If your application uses redirects for interaction, handleRedirectPromise must be called and awaited on each page load before determining if a user is signed in or not
    return instance.handleRedirectPromise().then(() => {
        const accounts = instance.getAllAccounts();
        console.log('accounts', accounts);
        if (accounts.length > 0) {
            console.log('user is already authenticated')
            return true;
        }

        // User is not signed in and attempting to access protected route. Sign them in.
        if (interactionType === InteractionType.Popup) {
            console.log('sign the user in using a pop-up')
            return instance.loginPopup(loginRequest).then(() => {
                console.log('user logged in')
                return true;
            }).catch(() => {
                console.log('authentication failed')
                return false;
            })
        } else if (interactionType === InteractionType.Redirect) {
            console.log('sign the user in using a redirect')
            return instance.loginRedirect(loginRequest).then(() => {
                console.log('user logged in')
                return true;
            }).catch(() => {
                console.log('authentication failed')
                return false;
            });
        }

        return false;
    }).catch(() => {
        return false;
    });
}
