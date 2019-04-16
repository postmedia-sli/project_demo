import { IEvent } from '../event/event'

export interface IAnalytics {
    initialize(settings: object): void
    bindEvents(events: IEvent[]): void
    getEventByType(type: string, value: string, action: string, element?: Element): IEvent
}
