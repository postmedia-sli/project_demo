export interface IProfile {
    mparticleId: string
    janrainId: string
    email: string
    name: string
    subscriber: boolean
    ageGated: boolean
    created: Date
    province: string
    postalCode: string
}

export class Profile implements IProfile {
    public mparticleId: string
    public janrainId: string
    public email: string
    public ageGated: boolean
    public created: Date
    public subscriber = false
    public province: string
    public postalCode: string

    constructor(public name: string, subscriber?: boolean) {
        this.subscriber = subscriber
    }

    public greet() {
        return 'Hello, ' + this.name
    }
}
