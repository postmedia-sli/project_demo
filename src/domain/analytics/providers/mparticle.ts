import { AnalyticsService } from '../../../services/analytics-service'
import { Entity } from '../../entity'
import { Event, IEvent } from '../../event/event'
import { IAnalytics } from '../i-analytics'
import { CategoryPageLoadEvent } from './mparticle/events/category-page-load-event'
import { DefaultEvent } from './mparticle/events/default-event'
import { IMparticleEvent } from './mparticle/events/i-mparticle-event'
import { MparticleEvent } from './mparticle/events/mparticle-event'
import { NavigationClickEvent } from './mparticle/events/navigation-click-event'
import { StoryPageLoadEvent } from './mparticle/events/story-page-load-event'
import { ViewPageLoadEvent } from './mparticle/events/view-page-load-event'
import { WidgetClickEvent } from './mparticle/events/widget-click-event'
import { WidgetVideoLoadEvent } from './mparticle/events/widget-video-load-event'
import { userOnChangeEvents } from './mparticle/user-on-change-events'

export interface IWindow extends Window {
    mParticle: any
}

declare let window: IWindow

export class MParticle extends Entity implements IAnalytics {

    public metaProperties: object
    public events: IEvent[]

    /**
     * userIdentities to be populated from identity service
     */
    public identityRequest: any = {
        userIdentities: {
            customerid: '87667576576576',
            email: 'postmedia.analytics@postmedia.com',
        },
    }

    constructor(configuration: any) {
        super()
        this.metaProperties = configuration.metaProperties
        this.events = configuration.analytics.events
    }

    /**
     * initialize mParticle
     *
     * TODO: isDevelopmentMode from configuration object
     * isDevelopmentMode: false (or removed) fro production
     *
     * identifyRequest: IDSync request, contains desired indentify
     * request. mParticle will use recent/previous indentities if
     * not provided
     * https://docs.mparticle.com/developers/sdk/web/idsync/
     *
     * identityCallback: get executed on successfull completion of
     * IDSync. Provides mParticle init information
     */
    public initialize(settings: object): void {
        const mParticle: any = {
            config: {
                appVersion: '1.0.0',
                customFlags: {},
                identifyRequest: this.identityRequest,
                identityCallback: this.mParticleCallback.bind(this),
                isDebug: true,
                isDevelopmentMode: true,
                isSandbox: true,
                sessionTimeout: 60,
                useCookieStorage: true,
                useNativeSdk: false,
            },
        };
        ((apiKey) => {
            window.mParticle = mParticle || {}
            window.mParticle.config = mParticle.config || {}
            window.mParticle.config.rq = []
            window.mParticle.ready = (f: any) => {
                mParticle.config.rq.push(f)
            }
            const mp = document.createElement('script')
            mp.type = 'text/javascript'
            mp.async = true
            mp.src = ('https:' === document.location.protocol ? 'https://jssdkcdns' : 'http://jssdkcdn') +
                '.mparticle.com/js/v2/' + apiKey + '/mparticle.js'
            const s = document.getElementsByTagName('script')[0]
            s.parentNode.insertBefore(mp, s)
        })((settings as any).workspace.key)
    }

    /**
     * mParticle init callback
     */
    public mParticleCallback(result: any) {
        const currentIdentities: any = result.getUser().getUserIdentities().userIdentities
        if (
            currentIdentities.other2 !== localStorage.getItem('globalmParticleCookieID')
            || null !== JSON.parse(localStorage.getItem('janrainCaptureProfileData'))
        ) {
            const identityObject: any = {}
            identityObject.userIdentities = {}
            if (currentIdentities.other2 !== localStorage.getItem('globalmParticleCookieID')) {
                identityObject.userIdentities.other2 = String(localStorage.getItem('globalmParticleCookieID'))
            }
            if (null !== JSON.parse(localStorage.getItem('janrainCaptureProfileData'))) {
                identityObject.userIdentities.customerid =
                    JSON.parse(localStorage.getItem('janrainCaptureProfileData')).uuid
                identityObject.userIdentities.email =
                    JSON.parse(localStorage.getItem('janrainCaptureProfileData')).email
            }
            // @todo - refactor this to use an arrow function
            // tslint:disable-next-line:only-arrow-functions
            window.mParticle.Identity.identify(identityObject, function() {
                // still need to handle the user events
                userOnChangeEvents(result)
            }.bind(this))
        }
    }

    /**
     * Bind click events to it elements
     * page-load evets are added to this.events and passed
     * over pageOnLoadEvents
     */
    public bindEvents(events: IMparticleEvent[]): void {
        for (const event of events) {
            // console.log(event);
            if (event instanceof MparticleEvent) {
                // if the event has been identified as an mparticle specific one, set the meta properties
                // - possibly not the cleanest way to do this
                event.setMetaProperties(this.metaProperties)
            }

            // if the event is a page load event, fire it right away
            if (AnalyticsService.ACTION_PAGE_LOAD === event.action) {
                // handle the event
                event.handle()

            } else {
                // otherwise add a click listener for the event
                event.element.addEventListener(
                    'click',
                    event.handle.bind(event),
                    false
                )
            }
        }
    }

    /**
     * Get the correct event object for the registered event type
     *
     * @param type
     * @param value
     * @param action
     * @param element
     */
    public getEventByType(type: string, value: string, action: string, element?: Element): IEvent {
        if (action === AnalyticsService.ACTION_CLICK) {
            switch (type.toLowerCase()) {
                case AnalyticsService.clickEventTypes.widget:
                    return new WidgetClickEvent(type, value, action, element)
                case AnalyticsService.clickEventTypes.navigation:
                    return new NavigationClickEvent(type, value, action, element)
                default:
                    return new DefaultEvent(type, value, action, element)
            }
        } else if (action === AnalyticsService.ACTION_PAGE_LOAD) {
            switch (type.toLowerCase()) {
                case AnalyticsService.pageLoadEventTypes.viewPage:
                    return new ViewPageLoadEvent(type, value, action, element)
                case AnalyticsService.pageLoadEventTypes.viewArticle:
                    return new StoryPageLoadEvent(type, value, action, element)
                case AnalyticsService.pageLoadEventTypes.widgetVideoLoad:
                    return new WidgetVideoLoadEvent(type, value, action, element)
                case AnalyticsService.pageLoadEventTypes.viewCategory:
                    return new CategoryPageLoadEvent(type, value, action, element)
                default:
                    return new DefaultEvent(type, value, action, element)
            }
        }

        return new DefaultEvent(type, value, action, element)
    }
}
