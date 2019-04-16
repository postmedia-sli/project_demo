import { Ad } from '../../domain/ads/ad'
import { AdSize, IAd } from '../../domain/ads/ad-base'
import { AdService } from './ad-service'
import { IAdServiceVerifiedAdapter } from './adapters/adapter'
import { AdURIFormatter } from './formatters/uri'
import { DefaultAdTargetingStrategy } from './targeting/default'

jest.mock('../../domain/ads/ad')
jest.mock('./targeting/default')

describe('services/ads/ad-service.ts', () => {
    let el: Element
    // const account = 'test-account'
    const adURI = '/test/ad/uri'
    const network = 'test-network'
    const property = 'test-property'
    // const site = 'test-site'
    const size: AdSize = [1, 1]
    const slot = 'test-slot'
    const target = { key: 'value' }
    const type = 'test-type'
    const verifierAccount = 'test-verifier-account'

    class TestAdServiceVerifiedAdapter implements IAdServiceVerifiedAdapter {
        public ads: IAd[] = []
        public adURI = adURI
        public registerAd = jest.fn()
        public requestAds = jest.fn()
        public target = jest.fn()
        public verifierAccount = jest.fn()
    }

    const mockAdapter = new TestAdServiceVerifiedAdapter()
    const mockFormatter = jest.fn((...args: any[]) => adURI) as AdURIFormatter
    const mockTargeter = new (DefaultAdTargetingStrategy as jest.Mock<DefaultAdTargetingStrategy>)()

    afterEach(() => {
        document.body.innerHTML = ''
    })

    beforeEach(() => {
        el = document.createElement('div')
        el.setAttribute(AdService.DOM.attrs.size, JSON.stringify(size))
        el.setAttribute(AdService.DOM.attrs.slot, slot)
        el.setAttribute(AdService.DOM.attrs.target, JSON.stringify(target))
        el.setAttribute(AdService.DOM.attrs.type, type)
        document.body.appendChild(el)
    })

    it('should init, configure and request ads', () => {
        const adService = new AdService(mockAdapter, mockFormatter, mockTargeter)
        adService.initialize(network, property, adURI, verifierAccount)

        // 'subscriber' flag set
        expect(adService.isSubscriber).toEqual(false)

        // formatted ad URI set
        expect(mockAdapter.adURI).toBeTruthy()

        // register call
        expect(mockAdapter.registerAd).toHaveBeenCalledTimes(1)

        // ad initialization
        expect(Ad).toHaveBeenCalledWith(el, slot, size, undefined, type)

        // targeting
        expect(mockTargeter.ad).toHaveBeenCalledTimes(1)
        expect(mockTargeter.page).toHaveBeenCalledTimes(1)

        // expect request call
        expect(mockAdapter.requestAds).toHaveBeenCalledTimes(1)
    })

    it('should throw on misconfigured ad element', () => {
        el.setAttribute(AdService.DOM.attrs.slot, '')

        const adService = new AdService(mockAdapter, mockFormatter, mockTargeter)

        expect(() => {
            adService.initialize(network, property, adURI, verifierAccount)
        }).toThrow()
    })

    it('should not call ads for subscribers', () => {
        const mockAdDisplay = jest.spyOn(Ad.prototype, 'display')
        const adService = new AdService(mockAdapter, mockFormatter, mockTargeter)
        adService.initialize(network, property, adURI, verifierAccount, true)

        expect(mockAdDisplay).toHaveBeenCalledWith(true)
    })
})
