import { IWindow } from '../mparticle'

declare let window: IWindow

export class PageEvents {

    /**
     * Custom event types
     * https://docs.mparticle.com/developers/sdk/web/event-tracking/#custom-event-type
     */

    public static mpEventType = {
        Location: 2,
        Navigation: 1,
        Other: 8,
        Search: 3,
        Social: 7,
        Transaction: 4,
        UserContent: 5,
        UserPreference: 6,
    }

    /**
     * Custome event names
     */

    public static mpEventName = {
        DefaultEvent: 'Default Event',
        NavigationClick: 'Navigation clicked',
        ScreenView: 'Sreen view',
        ViewArticle: 'View article',
        ViewCategory: 'View Category',
        WidgetClicked: 'Widget Clicked',
        WidgetInView: 'Widget in view',
        WidgetVideoLoad: 'Widget Video Load - Story'
    }

    /**
     * Implement mParticle's logPageView - https://docs.mparticle.com/developers/sdk/web/screen-tracking/
     * @param: string, object, object
     * @returns: boolean
     */

    public logPageView(EventType: string, properties: object, customFlag?: object): boolean {
        try {
            if (Object.keys(properties).length <= 0) {
                this.logCustomError({Error: 'Empty object is not acceptable'})
                return false
            }
            const args = arguments
            window.mParticle.ready(function() {
                window.mParticle.logPageView.apply(this, args)
            })
            return true
        } catch (e) {
            return false
        }
    }

    /**
     * Implement mParticle's logEvent - https://docs.mparticle.com/developers/sdk/web/event-tracking/
     * @param: string, number, object, object
     * @returns: boolean
     */

    public logEvent(EventName: string, EventType: number, properties: object, customFlag?: object): boolean {
        try {
            if (Object.keys(properties).length <= 0) {
                this.logCustomError({Error: 'Empty object is not acceptable'})
                return false
            }
            const args = arguments
            window.mParticle.ready(function() {
                window.mParticle.logEvent.apply(this, args)
            })
            return true
        } catch (e) {
            return false
        }
    }

    /**
     * Custom log event to log errors into mParticle
     * https://docs.mparticle.com/developers/sdk/web/event-tracking/
     */

    public logCustomError(errorMessage: object): void {
        this.logEvent('Log error', PageEvents.mpEventType.Other, errorMessage)
    }

    /**
     * Implement mParticle's logEvent - https://docs.mparticle.com/developers/sdk/web/event-tracking/
     * as default event. If an event match is not found, this event will be fired
     * @param: string, number, object, object
     * @returns: boolean
     */

    public logDefaultEvent(EventName: string, EventType: number, properties: object): boolean {
        try {
            if (Object.keys(properties).length <= 0) {
                this.logCustomError({Error: 'Empty object is not acceptable'})
                return false
            }
            const args = arguments
            window.mParticle.ready(function() {
                window.mParticle.logEvent.apply(this, args)
            })
            return true
        } catch (e) {
            return false
        }
    }
}
