import { Entity } from '../entity'

export type PageType = 'index' | 'story'

export interface IPageConfiguration {
    authors: string[]
    articleId: string
    cats: string[]
    originId: string
    type: PageType
}

export class PageConfiguration extends Entity implements IPageConfiguration {
    public authors: string[]
    public articleId: string
    public cats: string[]
    public originId: string
    public type: PageType
}
