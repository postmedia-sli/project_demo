
import { AdBase, AdSize, AdType } from './ad-base'

jest.mock('../../services/ads/ad-service')

describe('domain/ads/ad-base.ts', () => {
    const el = document.createElement('div')
    const size: AdSize = [1, 1]
    const slot = 'test-slot'
    const type = 'test-type' as AdType

    it('should initialize with element, slot and type', async () => {
        const ad = new AdBase(el, slot, size, undefined, type)
        expect(ad.el).toBe(el)
        expect(ad.slot).toBe(slot)
        expect(ad.type).toBe(type)

        // expect default type
        expect(new AdBase(el, slot).type).toBe(AdBase.defaultType)
    })

    it('should display ad', () => {
        const ad = new AdBase(el, slot, size, undefined, type)
        ad.display()
        expect(el.innerHTML).toContain('url:') // update as best suits the output
    })

    it('should display special message for subscribers', () => {
        const ad = new AdBase(el, slot, size, undefined, type)
        ad.display(true)
        expect(el.innerHTML).toContain('ad-free experience') // update as best suits the output
    })
})
