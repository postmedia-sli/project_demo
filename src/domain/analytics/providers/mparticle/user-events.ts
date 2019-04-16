import { IWindow } from '../mparticle'
import { PageEvents } from './page-events'

declare let window: IWindow

export class UserEvents extends PageEvents {

    public userProfile: any

    constructor() {
        super()
    }

    /**
     * Implement mParticle's setUserAttribute - https://docs.mparticle.com/developers/sdk/web/users/#set-user-attributes
     * User reserved attributes: $Age $FirstName $LastName $Gender $Mobile $Address $City $State $Zip $Country
     * @param: string, string
     * @returns: boolean
     */

    public setUserAttribute(attName: string, attValue: string): boolean {
        try {
            if ('' === attValue) {
                this.logCustomError({
                    Error: 'Empty attribute value is not acceptable',
                    Event: attName + ' attribute setup for user'
                })
                return false
            }
            const args = arguments
            window.mParticle.ready(() => {
                if (window.mParticle.Identity.getCurrentUser() !== undefined) {
                    window.mParticle.Identity
                    .getCurrentUser().setUserAttribute
                    .apply(window.mParticle.Identity.getCurrentUser(), args)
                }
            })
            return true
        } catch (e) {
            return false
        }
    }
}
