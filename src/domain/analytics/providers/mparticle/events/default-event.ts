import { CommonUtils } from '../../../../../utils/common-utils'
import { PageEvents } from '../page-events'
import { MparticleEvent } from './mparticle-event'

const mParticleEvents: any = new PageEvents()

export class DefaultEvent extends MparticleEvent {

    /**
     * Handle a widget click event
     */
    public handle(): void {

        const pageAttributes = this.metaProperties
        const domAttributes = CommonUtils.processEventAttributes(this.getProperties())

        /**
         * @var eventAttributes will be different for each
         * events
         *
         * there are events which has will have attributes
         * both from dom element and page meta properties
         *
         * more attributes can be added to address the event
         * such as URL, story title, ID etc.
         */

        const eventAttributes: any = domAttributes
        eventAttributes.Brand = pageAttributes.Brand

        mParticleEvents.logDefaultEvent(
            PageEvents.mpEventName.DefaultEvent,
            PageEvents.mpEventType.Other,
            eventAttributes
        )
    }
}
