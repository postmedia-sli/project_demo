import { DOMUtils } from './dom-utils'

describe('utils/dom-utils.ts', () => {
    describe('#loadScript', () => {
        beforeEach(() => {
            document.body.innerHTML = ''
        })

        it('should add script element to body', () => {
            DOMUtils.loadScript('foo')
            expect(document.getElementsByTagName('script')).toBeTruthy()
        })

        it('should use https', () => {
            const src = 'http://test.js'
            DOMUtils.loadScript(src)
            expect(document.getElementsByTagName('script')[0].getAttribute('src')).toBe('https://test.js')
        })
    })
})
