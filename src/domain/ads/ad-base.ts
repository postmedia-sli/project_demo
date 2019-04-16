import { AdTargets } from '../../services/ads/targeting/target'
import { CommonUtils } from '../../utils/common-utils'
import { Entity } from '../entity'

export type AdSize = number[]
export type AdSizes = AdSize | AdSize[]
export type AdType = 'html' | 'video'

export interface IAd {
    el: Element
    id: string
    slot: string
    size: AdSizes
    targets?: AdTargets
    type: AdType

    display(isSubscriber: boolean): void
}

export class AdBase extends Entity implements IAd {
    public static defaultSizeX = 300
    public static defaultSizeY = 250
    public static defaultSize: AdSize = [AdBase.defaultSizeX, AdBase.defaultSizeY]
    public static defaultType: AdType = 'html'

    public id: string
    public size: AdSizes
    public type: AdType

    /**
     * Initializes the ad.
     *
     * @param {Element} el container DOM element
     * @param {string} slot name of ad slot
     * @param {AdSizes} size
     * @param {AdTargets} targets
     * @param {AdType} type
     */
    public constructor(
        public el: Element,
        public slot: string,
        size?: AdSizes,
        public targets?: AdTargets,
        type?: AdType) {
        super()

        // require id
        if (!el.hasAttribute('id')) {
            el.setAttribute('id', `ad-${CommonUtils.shortId()}`)
        }

        this.id = el.getAttribute('id')
        this.size = size || AdBase.defaultSize
        this.type = type || AdBase.defaultType
    }

    /**
     * Display an ad on the page
     *
     * @param isSubscriber
     */
    public display(isSubscriber = false): void {
        const a = { url: 'bar' }

        if (isSubscriber) {
            this.el.innerHTML = `We are happy to offer you and ad-free experience`
        } else {
            this.el.classList.add('ad-red')
            this.el.innerHTML = `slot:${this.slot} <br/>type:${this.type} <br/> url:${a.url}`
        }
    }
}
