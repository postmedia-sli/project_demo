import { AdType } from '../../../domain/ads/ad-base'
import { AdService } from '../ad-service'
import { IAdTargetStrategyHandler } from './strategy'
import { AdTarget, AdTargets } from './target'

export class DefaultAdTargetingStrategy implements IAdTargetStrategyHandler {
    public keyNames = {
        articleId: 'aid',
        author: 'author',
        category: 'ck',
        network: 'nk',
        page: 'page',
        property: 'pr',
        slot: 'loc', // NOPE
        subCategory: 'sck',
        test: 'test',
        type: 'type'
    }

    public ad(el: Element): AdTargets {
        return JSON.parse(el.getAttribute(AdService.DOM.attrs.target)) || []
    }

    public page(
        network: string,
        property: string,
        articleId?: string,
        authors?: string[],
        categories?: string[],
        originId?: string,
        pageName?: string,
        type: AdType = 'html'): AdTargets {

        const targets: AdTargets = []

        // article/origin ids
        if (articleId && originId) {
            targets.push(new AdTarget(this.keyNames.articleId, [articleId, originId]))
        }

        // authors
        if (authors) {
            targets.push(new AdTarget(this.keyNames.author, authors))
        }

        // categories
        if (categories && categories.length) {
            targets.push(new AdTarget(this.keyNames.category, categories[0]))

            // sub-categories
            if (categories.length > 1) {
                targets.push(new AdTarget(this.keyNames.subCategory, categories.slice(1)))
            }
        }

        // network
        targets.push(new AdTarget(this.keyNames.network, network))

        // page
        if (pageName) {
            targets.push(new AdTarget(this.keyNames.page, pageName))
        }

        // property
        targets.push(new AdTarget(this.keyNames.property, property))

        // type
        targets.push(new AdTarget(this.keyNames.type, type))

        return targets
    }
}
