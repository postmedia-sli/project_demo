import { Entity } from '../entity'

export interface IAnalyticsConfiguration {
    provider: string
    providerSettings: object
}

export class AnalyticsConfiguration extends Entity implements IAnalyticsConfiguration {
    public provider: string
    public providerSettings: object

    public constructor(configuration: any) {
        super()

        this.fromJson(configuration, true)
    }

    public fromJson<T>(jsonObject: object, convertToCamel?: boolean): IAnalyticsConfiguration {
        super.fromJson(jsonObject, true)

        if (jsonObject && (jsonObject as any).providerSettings) {
            this.providerSettings = (jsonObject as any).providerSettings
        }

        return this
    }
}
