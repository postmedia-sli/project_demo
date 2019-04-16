/**
 * Creates key:value identifiers used to target ads. E.g. author=jane-doe
 */

export type AdTargets = AdTarget | AdTarget[]

export class AdTarget {
    constructor(public key: string, public value: string | string[]) { }
}
