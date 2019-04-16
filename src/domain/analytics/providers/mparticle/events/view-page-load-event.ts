import { PageEvents } from '../page-events'
import { MparticleEvent } from './mparticle-event'

const mParticleEvents: any = new PageEvents()

export class ViewPageLoadEvent extends MparticleEvent {

    /**
     * Handle a view page load event
     */
    public handle(): void {

        /**
         * @var eventAttributes will be different for each
         * events
         *
         * there are events which has will have attributes
         * both from dom element and page meta properties
         */

        const eventAttributes: object = this.metaProperties

        mParticleEvents.logPageView(
            PageEvents.mpEventName.ScreenView,
            eventAttributes,
            {}
        )
    }
}
