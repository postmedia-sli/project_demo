import { AdSizes, IAd } from '../../../domain/ads/ad-base'
import { AdTargets } from '../targeting/target'

export interface IAdServiceAdapter {
    ads: IAd[]
    adURI: string

    registerAd(ad: IAd): void
    requestAds(): void
    target(target: AdTargets): void
}

export interface IAdServiceVerifiedAdapter extends IAdServiceAdapter {
    verifierAccount(account: string): void
}
