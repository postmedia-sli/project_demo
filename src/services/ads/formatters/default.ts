import { AdURIFormatter } from './uri'

/**
 * This forms the equivalent of a page identifier for requests to an ad service.
 *
 * @param accountId
 * @param siteId
 * @param cats
 */
export const defaultAdURIFormatter: AdURIFormatter = (
    accountId: string,
    siteId: string,
    cats?: string[]): string => {

    // unintuitively, all paths currently have `story` suffix (never `index`)
    return `/${accountId}/${siteId}/${cats && cats.length && (cats.join('/') + '/') || ''}story`
}
