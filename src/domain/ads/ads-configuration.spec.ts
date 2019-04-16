import { EntityBuilder } from '../entity-builder'
import { AdsConfiguration } from './ads-configuration'

describe('domain/ads/ads-configuration.ts', () => {
    const testConf = {
        account: 'test-account',
        network: 'test-network',
        property: 'test-property',
        site: 'test-site'
    }

    it('should parse expected config properties', () => {
        const adConf = EntityBuilder.buildOne<AdsConfiguration>(AdsConfiguration, testConf)
        expect(adConf.account).toBe(testConf.account)
        expect(adConf.network).toBe(testConf.network)
        expect(adConf.property).toBe(testConf.property)
        expect(adConf.site).toBe(testConf.site)
    })
})
