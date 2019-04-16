import { PageEvents } from '../page-events'
import { MparticleEvent } from './mparticle-event'

const mParticleEvents: any = new PageEvents()

export class StoryPageLoadEvent extends MparticleEvent {

    /**
     * Handle a story page load event
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

        mParticleEvents.logEvent(
            PageEvents.mpEventName.ViewArticle,
            PageEvents.mpEventType.Navigation,
            eventAttributes,
            {'Google.NonInteraction': true}
        )
    }
}
