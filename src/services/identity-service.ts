import { Profile } from '../domain/identity/profile'

export class IdentityService {

    /**
     * Get the current identity.
     *
     * @todo update to retrieve from cookie / session
     */
    public async getIdentity(): Promise<Profile> {
        const p = new Profile('toto')
        return Promise.resolve(p)
    }
}
