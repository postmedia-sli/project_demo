import { Class } from '../utils/class'

/**
 * An entity builder helper
 */
export class EntityBuilder {

    /**
     * Will dynamically build an instance of a entity class given
     *
     * @param buildClass
     * @param data
     * @param convertToCamel
     * @returns {any}
     */
    public static buildOne<T>(buildClass: any, data: any, convertToCamel?: boolean): T {
        const instance: any = Class.make(buildClass)
        instance.fromJson(data, convertToCamel)

        return instance
    }

    /**
     * Will dynamically build many instances of an entity class given
     *
     * @param buildClass
     * @param data
     * @param convertToCamel
     * @returns {Array<T>}
     */
    public static buildMany<T>(buildClass: any, data: Array<{}>, convertToCamel?: boolean): T[] {
        const entities: T[] = []

        if (data) {
            for (const element of data) {
                const instance: any = Class.make(buildClass)
                entities.push(instance.fromJson(element, convertToCamel))
            }
        }

        return entities
    }
}
