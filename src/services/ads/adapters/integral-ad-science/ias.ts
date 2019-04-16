import { DOMUtils } from '../../../../utils/dom-utils'
import { Mixin } from '../../../../utils/mixin'
import { IAdServiceAdapter, IAdServiceVerifiedAdapter } from '../adapter.d'

interface IWindow {
    __iasPET: any
}

declare let window: IWindow

export const WithIntegralAdScience = <T extends Mixin<IAdServiceAdapter>>(Base: T) =>
    class extends Base implements IAdServiceVerifiedAdapter {
        private iasJsSrc = 'cdn.adsafeprotected.com/iasPET.1.js'

        /**
         * Initializes IAS (load js, setup global object).
         */
        constructor(...args: any[]) {
            super(...args)

            // load JS
            if (!document.querySelector(`script[src $= "${this.iasJsSrc}"]`)) {
                DOMUtils.loadScript(this.iasJsSrc)
            }

            // setup object
            window.__iasPET = window.__iasPET || {}
            window.__iasPET.queue = window.__iasPET.queue || []
        }

        /**
         * Requests targeting info from IAS service for all page ads.
         * Upon response sends request to service adapter.
         *
         * NOTE: no online docs. TODO: put PDF in confluence and link here.
         */
        public requestAds() {
            window.__iasPET.queue.push({
                adSlots: this.ads.map((ad) => ({
                    adSlotId: ad.id,
                    adUnitPath: this.adURI,
                    size: ad.size
                })),
                dataHandler: () => {
                    window.__iasPET.setTargetingForGPT()
                    super.requestAds()
                }
            })
        }

        /**
         * Sets account id on global object.
         */
        public verifierAccount(account: string) {
            window.__iasPET.pubId = account
        }
    }
