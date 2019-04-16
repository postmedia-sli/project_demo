import { AdBase } from '../../../../domain/ads/ad-base'
import { DOMUtils } from '../../../../utils/dom-utils'
import { AdTarget } from '../../targeting/target'
import { GPTAdapter } from './gpt'

jest.mock('../../../../utils/dom-utils')

interface IWindow extends Window {
  googletag: any
}

declare let window: IWindow

describe('/services/ads/adapters/google-publisher-tag/gpt.ts', () => {
    const adURI = '/test/ad'
    const cmd = {
        push: (f: () => void) => {
            expect(f).toBeInstanceOf(Function)
            f()
        }
    }
    const id = 'test-id'
    const size = [1, 1]

    beforeEach(() => {
        document.body.innerHTML = ''
        jest.resetAllMocks()
    })

    it('should load js, setup `googletag` object and queue', () => {
        const loadScript = jest.spyOn(DOMUtils, 'loadScript')
        const gpt = new GPTAdapter()
        expect(loadScript).toHaveBeenCalledTimes(1)
        expect(window.googletag).toEqual({cmd: []})
    })

    describe('#registerAd', () => {
        it('should set callback to define slot and apply targeting', () => {
            const addService = jest.fn()
            const defineSlot = jest.fn(() => ({ addService, setTargeting }))
            const el = document.createElement('div')
            const gpt = new GPTAdapter()
            const pubads = 'any'
            const setTargeting = jest.fn()
            const targetKey = 'test key'
            const targetVal = 'test value'
            el.setAttribute('id', id)
            window.googletag.cmd = cmd
            window.googletag.defineSlot = defineSlot
            window.googletag.pubads = jest.fn(() => pubads)

            gpt.adURI = adURI
            gpt.registerAd(new AdBase(el, 'slot', size, new AdTarget(targetKey, targetVal)))

            expect(defineSlot).toHaveBeenCalledWith(adURI, size, id)
            expect(addService).toHaveBeenCalledWith(pubads)
            expect(setTargeting).toHaveBeenCalledWith(targetKey, targetVal)
        })
    })

    describe('#requestAds', () => {
        it('should set callback to enable and display ads', () => {
            const display = jest.fn()
            const el = document.createElement('foo')
            const enableServices = jest.fn()
            const enableSingleRequest = jest.fn()
            const gpt = new GPTAdapter()
            el.setAttribute('id', id)
            window.googletag.cmd = cmd
            window.googletag.display = display
            window.googletag.enableServices = enableServices
            window.googletag.pubads = () => ({ enableSingleRequest })

            gpt.ads.push(new AdBase(el, 'slot', size))
            gpt.requestAds()

            expect(enableSingleRequest).toHaveBeenCalledTimes(1)
            expect(enableServices).toHaveBeenCalledTimes(1)
            expect(display).toHaveBeenCalledTimes(1)
            expect(display).toHaveBeenCalledWith(id)
        })
    })

    describe('#target', () => {
        it('should set callback to apply supplied targeting', () => {
            const gpt = new GPTAdapter()
            const setTargeting = jest.fn()
            const targetKey = 'test key'
            const targetVal = 'test value'
            window.googletag.cmd = cmd
            window.googletag.pubads = () => ({ setTargeting })

            gpt.target(new AdTarget(targetKey, targetVal))
            expect(setTargeting).toHaveBeenCalledWith(targetKey, targetVal)
        })
    })
})
