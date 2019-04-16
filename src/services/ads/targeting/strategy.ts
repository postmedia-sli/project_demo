import { AdTargets } from './target'

export interface IAdTargetStrategyHandler {
    ad: (el: Element) => AdTargets
    page: (
        network: string,
        property: string,
        articleId?: string,
        author?: string[],
        categories?: string[],
        originId?: string,
        page?: string
    ) => AdTargets
}
