import { AdService } from '../../../services/ads/ad-service'
import { Mixin } from '../../../utils/mixin'
import { IAd } from '../ad-base'

export const WithSticky = <T extends Mixin<IAd>>(Base: T) =>
    class extends Base {
        constructor(...args: any[]) {
            super(...args)

            // init stuff
            this.initElement()
            this.addListeners()
        }

        // add mixin-specific functionality...

        private addListeners() {
            document.addEventListener('scroll', this.onScroll.bind(this))
        }

        private initElement() {
            // set attribute for CSS magic - use bare minimum
            this.el.setAttribute(AdService.DOM.attrs.sticky, '')
        }

        private onScroll() {
            if ('some condition') {
                // un stick
                this.el.removeAttribute(AdService.DOM.attrs.sticky)
            }
        }
    }
