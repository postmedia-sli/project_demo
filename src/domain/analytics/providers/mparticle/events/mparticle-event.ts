import { Event } from '../../../../event/event'
import { IMparticleEvent } from './i-mparticle-event'

export class MparticleEvent extends Event implements IMparticleEvent {

    protected metaProperties: any

    /**
     * Set meta properties for use in any extended event
     *
     * @param metaProperties
     */
    public setMetaProperties(metaProperties: any): void {
        this.metaProperties = metaProperties
    }

    /**
     * Get the base properties for an mparticle event, safely parsing the value
     */
    public getProperties(): any {

        if (this.value && this.value.length && JSON.parse(this.value)) {
            return JSON.parse(this.value)
        }

        return undefined
    }
}
