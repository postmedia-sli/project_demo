import { Profile } from '../../../identity/profile'
import { UserEvents } from './user-events'

const userProfile = new Profile('Annonymus User')
const mParticleEvents: any = new UserEvents()

export const userOnChangeEvents = (result: any) => {

    // Set user's province into mParticle
    if (userProfile.province) {
        mParticleEvents.setUserAttribute('$State', userProfile.province)
    }

    // Set user's postal code into mParticle
    if (userProfile.postalCode) {
        mParticleEvents.setUserAttribute('$Zip', userProfile.postalCode)
    }

    // Set mParticle ID as user attribute
    const mParticleID = String(result.body.mpid)
    if (mParticleID) {
        userProfile.mparticleId = mParticleID
        mParticleEvents.setUserAttribute('MPID', mParticleID)
    }

    // Set if the user age gated - must be a string value
    if (String(userProfile.ageGated)) {
        mParticleEvents.setUserAttribute('Claimed 19+', String(userProfile.ageGated))
    }
}
