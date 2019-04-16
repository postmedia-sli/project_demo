import { IAd } from '../../../../domain/ads/ad-base'
import { DOMUtils } from '../../../../utils/dom-utils'
import { AdTarget, AdTargets } from '../../targeting/target'
import { IAdServiceAdapter } from '../adapter'

interface IWindow extends Window {
  googletag: any
}

declare let window: IWindow

export class GPTAdapter implements IAdServiceAdapter {
    public ads: IAd[] = []
    public adURI: string

    private jsSrc = 'https://www.googletagservices.com/tag/js/gpt.js'

    /**
     * Initializes GPT (instantiate global object and queue).
     */
    constructor() {
        // load GPT JS
        DOMUtils.loadScript(this.jsSrc)

        // setup queue
        window.googletag = window.googletag || {}
        window.googletag.cmd = window.googletag.cmd || []
    }

    /**
     * Calls `defineSlot` for given ad.
     *
     * @param ad
     */
    public registerAd(ad: IAd): void {

        // store registered ads
        this.ads.push(ad)

        // queue slot definition
        window.googletag.cmd.push(() => {
            const slot = window.googletag.defineSlot(this.adURI, ad.size, ad.id)
            slot.addService(window.googletag.pubads())
                ; // important semi-colon - absense causes GPT error (something about compilation presumably)
            [...ad.targets].map((target: AdTarget) =>
                slot.setTargeting(target.key, target.value))
        })
    }

    /**
     * Calls `enableServices` to load ads, then `display` per ad.
     */
    public requestAds(): void {
        window.googletag.cmd.push(() => {
            window.googletag.pubads().enableSingleRequest()
            window.googletag.enableServices()
            this.ads.forEach((ad) => window.googletag.display(ad.id))
        })
    }

    /**
     * Sets page-level targeting information.
     */
    public target(targets: AdTargets): void {
        window.googletag.cmd.push(() =>
            [...targets].map((target) =>
                window.googletag.pubads().setTargeting(target.key, target.value)))
    }
}
