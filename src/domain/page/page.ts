/**
 * Page class is intended to capture different properties for HTML pages
 * Supply those properties for services to use them (ie. analytics to mParticle).
 *
 * Any specific formatting of properties or types should be done in concrete classes for the third-part provider, not
 * here.
 */

import { AdService } from '../../services/ads/ad-service'
import { GPTAdapter } from '../../services/ads/adapters/google-publisher-tag/gpt'
import { WithIntegralAdScience } from '../../services/ads/adapters/integral-ad-science/ias'
import { defaultAdURIFormatter } from '../../services/ads/formatters/default'
import { DefaultAdTargetingStrategy } from '../../services/ads/targeting/default'
import { AnalyticsService } from '../../services/analytics-service'
import { IdentityService } from '../../services/identity-service'
import { IConfiguration } from '../configuration'
import { IProfile } from '../identity/profile'

export class Page {
    public domain = 'mydomain'
    public url = 'mypageurl'
    public category = 'mycategory'
    public subcategory = 'mysubcategory'

    private currentProfile: IProfile

    constructor(
        private configuration: IConfiguration,
        private adService: AdService,
        private analyticsService: AnalyticsService,
        private identityService: IdentityService) {

        this.identityService
            .getIdentity()
            .then(this.identityReady.bind(this))

        this.url = document.location.href
    }

    /**
     * Actions requiring user profile
     */
    private identityReady(profile: IProfile) {
        this.currentProfile = profile

        // initialize ad service
        this.adService.initialize(
            // this.configuration.ads.account,
            this.configuration.ads.network,
            this.configuration.ads.property,
            // this.configuration.ads.site,
            this.configuration.ads.uri,
            this.configuration.ads.verifierAccount,
            profile.subscriber,
            this.configuration.page.articleId,
            this.configuration.page.authors,
            this.configuration.page.cats,
            this.configuration.page.originId,
            this.configuration.page.type)

        // initialize analytics
        this.analyticsService.initializeProvider(this.configuration)
    }
}

export const registerPage = (jsonConfig: any): Page => {
    return new Page(
        jsonConfig,
        new AdService(
            new (WithIntegralAdScience(GPTAdapter))(),
            defaultAdURIFormatter,
            new DefaultAdTargetingStrategy()),
        new AnalyticsService(),
        new IdentityService())
}
