import { CommonUtils } from '../../../../../utils/common-utils'
import { PageEvents } from '../page-events'
import { MparticleEvent } from './mparticle-event'

const mParticleEvents: any = new PageEvents()

export class WidgetVideoLoadEvent extends MparticleEvent {

    /**
     * Handle a widget click event
     */
    public handle(): void {

        const domAttributes = CommonUtils.processEventAttributes(this.getProperties())

        /**
         * @var eventAttributes will be different for each
         * events
         *
         * there are events which has will have attributes
         * both from dom element and page meta properties
         */

        const eventAttributes: any = domAttributes

        mParticleEvents.logEvent(
            PageEvents.mpEventName.WidgetVideoLoad,
            PageEvents.mpEventType.Navigation,
            eventAttributes
        )
    }
}
