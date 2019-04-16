import { AdBase, IAd } from '../../../../domain/ads/ad-base'
import { DOMUtils } from '../../../../utils/dom-utils'
import { AdTargets } from '../../targeting/target'
import { IAdServiceAdapter } from '../adapter.d'
import { WithIntegralAdScience } from './ias'

jest.mock('../../../../utils/dom-utils')

interface IWindow extends Window {
    __iasPET: any
}

declare let window: IWindow

describe('/services/ads/adapters/integral-ad-science/ias.ts', () => {
    const account = 'test-account'
    const adEl = document.createElement('div')
    const adURI = '/test/ad'
    const id = 'test-id'
    const superRequestAds = jest.fn()
    const sizes = [1, 1]
    const targets: AdTargets = undefined
    class TestAdapter implements IAdServiceAdapter {
        public ads: IAd[] = []
        public adURI = adURI
        public registerAd = jest.fn()
        public target = jest.fn()
        public requestAds() { // setting mock here obliterates trait override
            superRequestAds() // ...so just calling it here
        }
    }

    it('should load js, setup global object and queue', () => {
        const loadScript = jest.spyOn(DOMUtils, 'loadScript')
        const ias = new (WithIntegralAdScience(TestAdapter))()

        expect(loadScript).toHaveBeenCalledTimes(1)
        expect(window.__iasPET).toEqual({ queue: [] })
    })

    describe('#requestAds', () => {
        it('should enqueue slot objects and call super upon response', () => {
            const ias = new (WithIntegralAdScience(TestAdapter))()
            let enqueued = false
            adEl.setAttribute('id', id)
            window.__iasPET.setTargetingForGPT = jest.fn()
            window.__iasPET.queue = {
                push: jest.fn((obj) => {
                    enqueued = true
                    expect(obj).toHaveProperty('adSlots', [{
                        adSlotId: id,
                        adUnitPath: adURI,
                        size: sizes
                    }])
                    expect(obj).toHaveProperty('dataHandler')

                    // confirm that handler calls super
                    obj.dataHandler()
                    expect(window.__iasPET.setTargetingForGPT).toHaveBeenCalledTimes(1)
                    expect(superRequestAds).toHaveBeenCalledTimes(1)
                })
            }

            ias.ads.push(new AdBase(adEl, 'slot', sizes, targets))
            ias.requestAds()
            expect(enqueued).toBe(true) // make sure assertions in `push` mock are executed
        })
    })

    describe('#verifierAccount', () => {
        it('should set account id on global object', () => {
            const ias = new (WithIntegralAdScience(TestAdapter))()
            ias.verifierAccount(account)

            expect(window.__iasPET.pubId).toBe(account)
        })
    })
})
