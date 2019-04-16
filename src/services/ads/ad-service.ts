import { Ad } from '../../domain/ads/ad'
import { AdType, IAd } from '../../domain/ads/ad-base'
import { PageType } from '../../domain/page/page-configuration'
import { IAdServiceVerifiedAdapter } from './adapters/adapter.d'
import { AdURIFormatter } from './formatters/uri'
import { IAdTargetStrategyHandler } from './targeting/strategy'

export class AdService {
    /**
     * Required DOM selectors and attributes.
     *
     * IMPORTANT: These will be duplicated elsewhere (templates, css) so ensure changes are coordinated
     * and instances minimized.
     */
    public static DOM = {
        attrs: {
            size: 'data-ad-size',
            slot: 'data-ad',
            sticky: 'data-ad-sticky',
            target: 'data-ad-target',
            type: 'data-ad-type'
        }
    }

    public isSubscriber = false

    /**
     * Stores adapter, formatter, targeter refs.
     */
    public constructor(
        private adapter: IAdServiceVerifiedAdapter,
        private formatter: AdURIFormatter,
        private targeting: IAdTargetStrategyHandler) { }

    /**
     * Registers ads in DOM via primary attribute selector (slot), configure targeting.
     */
    public initialize(
        // accountId: string,
        network: string,
        property: string,
        // siteId: string,
        uri: string,
        verifierAccountId: string,
        isSubscriber?: boolean,
        articleId?: string,
        authors?: string[],
        categories?: string[],
        originId?: string,
        page?: PageType,
    ): void {

        // TODO: aim to remove logic from HTML for URI generation (and use formatter approach)
        // this.adapter.adURI = this.formatter(accountId, siteId, categories)
        this.adapter.adURI = uri
        this.adapter.verifierAccount(verifierAccountId)
        this.isSubscriber = isSubscriber || false

        // register ads
        this.registerAds()

        // configuration and request only required for non-subscribers
        if (!isSubscriber) {

            // configure page level targeting (applies to all ads on a page)
            this.adapter.target(
                this.targeting.page(
                    network,
                    property,
                    articleId,
                    authors,
                    categories,
                    originId,
                    page))

            // request
            this.adapter.requestAds()
        }
    }

    /**
     * Registers ads with service adapter or displays subscriber messaging.
     */
    private registerAds(): void {
        this.getDocAds().map((ad) =>
            this.isSubscriber ? ad.display(true) : this.adapter.registerAd(ad))
    }

    /**
     * Retrieve all ads from DOM via `AdService.DOM.attrs.slot` attribute.
     */
    private getDocAds(): IAd[] {
        return [...document.querySelectorAll(`[${AdService.DOM.attrs.slot}]`)]
            .map(this.toAd.bind(this))
    }

    private toAd(el: Element): IAd {
        const slot: string = el.getAttribute(AdService.DOM.attrs.slot) || ''

        // require slot value (not just empty attr)
        if (!slot) {
            throw Error(`AdService.toAd - Ad element missing required ${AdService.DOM.attrs.slot} attribute value.`)
        }

        return new Ad(
            el,
            slot,
            JSON.parse(el.getAttribute(AdService.DOM.attrs.size)),
            this.targeting.ad(el),
            el.getAttribute(AdService.DOM.attrs.type) as AdType)
    }
}

// let googletag = googletag || {};
// googletag.cmd = googletag.cmd || [];

// FOR REFERENCE: this is how a google SRA call works
// <script async="async" src="https://www.googletagservices.com/tag/js/gpt.js">
// </script>
// <script>
//   var googletag = googletag || {};
//   googletag.cmd = googletag.cmd || [];

//   googletag.cmd.push(function() {
//     googletag.pubads().set("adsense_background_color", "FFFFFF");
//   });

//   googletag.cmd.push(function() {
//     googletag.defineSlot("/1234/travel/asia", [728, 90], "adslot0")
//       .addService(googletag.pubads())
//       .setTargeting("interests", ["sports", "music", "movies"]);
//     googletag.defineSlot("/1234/travel/asia", [[468, 60], [728, 90], [300, 250]], "adslot1")
//       .addService(googletag.pubads())
//       .setTargeting("gender", "male")
//       .setTargeting("age", "20-30");
//     googletag.pubads().setTargeting("topic","basketball");
//     googletag.pubads().enableSingleRequest();
//     googletag.enableServices();
//   });
// </script>
