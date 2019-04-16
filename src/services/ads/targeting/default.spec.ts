import { AdService } from '../ad-service'
import { DefaultAdTargetingStrategy } from './default'
import { AdTarget } from './target'

describe('services/ads/targeting/default.ts', () => {
    describe('DefaultAdTargetingStrategy', () => {
        let el: Element
        const slot = 'test-slot'
        const targetKey = 'testKey'
        const targetVal = 'test value'
        const targets = { [targetKey]: targetVal }

        afterEach(() => {
            document.body.innerHTML = ''
        })

        beforeEach(() => {
            el = document.createElement('div')
            el.setAttribute(AdService.DOM.attrs.slot, slot)
            el.setAttribute(AdService.DOM.attrs.target, JSON.stringify(targets))
            document.body.appendChild(el)
        })

        it('should extract targets from ad element', () => {
            const target = new DefaultAdTargetingStrategy()
            expect(target.ad(el)).toEqual(targets)

            // test when no target attr
            el.removeAttribute(AdService.DOM.attrs.target)
            expect(target.ad(el)).toEqual([])
        })

        it('should return expected page targets', () => {
            const articleId = 'test-article-id'
            const authors = ['test-author1', 'test-author2']
            const cats = ['test-cat', 'test-sub-cat']
            const network = 'test-network'
            const originId = 'test-origin-id'
            const pageName = 'test-page-name'
            const property = 'test-property'
            const target = new DefaultAdTargetingStrategy()
            const typeDefault = 'html'

            // confirm page-level key assignments
            expect(target.page(network, property, articleId, authors, cats, originId, pageName)).toEqual([
                new AdTarget(target.keyNames.articleId, [articleId, originId]),
                new AdTarget(target.keyNames.author, authors),
                new AdTarget(target.keyNames.category, cats[0]),
                new AdTarget(target.keyNames.subCategory, cats.slice(1)),
                new AdTarget(target.keyNames.network, network),
                new AdTarget(target.keyNames.page, pageName),
                new AdTarget(target.keyNames.property, property),
                new AdTarget(target.keyNames.type, typeDefault)
            ])

            // confirm default type
            expect([...target.page(network, property, articleId, authors, cats, originId, pageName, 'video')]
                .indexOf(new AdTarget(target.keyNames.type, 'index'))).toBeTruthy()
        })
    })
})
