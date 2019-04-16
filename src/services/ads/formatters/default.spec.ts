import { defaultAdURIFormatter } from './default'

describe('services/ads/formatters/default.ts', () => {
    const account = 'test-account'
    const site = 'test-site'
    const delim = '/'

    it('should start with account id', () => {
        expect((new RegExp(`^${delim}${account}${delim}`)).test(defaultAdURIFormatter(account, site))).toBeTruthy()
    })

    it('should contain cat/sub-cat slugs', () => {
        const cats = ['one', 'two']
        const parts = defaultAdURIFormatter(account, site, cats).split(delim)
        cats.map((cat) => expect(parts.indexOf(cat)).toBeTruthy())
    })

    it('should end with "/story"', () => {
        expect((new RegExp(`${delim}story$`)).test(defaultAdURIFormatter(account, site))).toBeTruthy()
    })
})
