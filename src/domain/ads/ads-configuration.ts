import { Entity } from '../entity'

export interface IAdsConfiguration {
    account: string
    network: string
    property: string
    site: string
    uri: string // TODO: deprecate asap. Composition logic should live in a formatter.
    verifierAccount: string
}

export class AdsConfiguration extends Entity implements IAdsConfiguration {
    public account: string
    public network: string
    public property: string
    public site: string
    public uri: string
    public verifierAccount: string
}
