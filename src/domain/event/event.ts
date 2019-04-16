import { Entity } from '../entity'

export interface IEvent {
    type: string
    value: string
    action: string
    element?: Element

    handle(): void
}

/**
 * Generic event class.  To be used for triggering things based on actions (ie. page load or click)
 */
export class Event extends Entity implements IEvent {

    public constructor(public type: string, public value: string, public action: string, public element?: Element) {
        super()
    }

    /**
     * Handle an event firing
     */
    public handle(): void {
        // handle default case
    }
}
