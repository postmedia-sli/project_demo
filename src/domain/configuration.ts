import { AdsConfiguration, IAdsConfiguration } from './ads/ads-configuration'
import { AnalyticsConfiguration, IAnalyticsConfiguration } from './analytics/analytics-configuration'
import { Entity } from './entity'
import { EntityBuilder } from './entity-builder'
import { IPageConfiguration, PageConfiguration } from './page/page-configuration'

export interface IConfiguration {
    ads: IAdsConfiguration
    analytics: IAnalyticsConfiguration
    page: IPageConfiguration

    metaProperties: object
}

export class Configuration extends Entity implements IConfiguration {
    public ads: IAdsConfiguration
    public analytics: IAnalyticsConfiguration
    public metaProperties: object
    public page: IPageConfiguration

    public constructor(configuration: any) {
        super()

        if (configuration && configuration.ads) {
            this.ads = EntityBuilder.buildOne(AdsConfiguration, configuration.ads)
        }

        if (configuration && configuration.analytics) {
            this.analytics = EntityBuilder.buildOne(AnalyticsConfiguration, configuration.analytics)
        }

        if (configuration && configuration.metaProperties) {
            this.metaProperties = configuration.metaProperties
        }

        if (configuration && configuration.page) {
            this.page = EntityBuilder.buildOne(PageConfiguration, configuration.page)
        }
    }
}
