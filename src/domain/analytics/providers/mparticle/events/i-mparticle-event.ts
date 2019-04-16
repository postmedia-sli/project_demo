import { IEvent } from '../../../../event/event'

export interface IMparticleEvent extends IEvent {
    setMetaProperties(metaProperties: any): void

    getProperties(): any
}
