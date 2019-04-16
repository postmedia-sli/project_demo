/**
 * An interface to export/import JSON
 */
import { EntityDecoder } from './entity-decoder'

/**
 * An entity interface
 */
export interface IEntity {
    fromJson<T>(jsonObject: object, convertToCamel?: boolean): any
}

/**
 * An abstract entity class.  All concrete classes should extend this.
 */
export abstract class Entity implements IEntity {
    public fromJson<T>(jsonObject: object, convertToCamel?: boolean): any {
        return EntityDecoder.jsonDecode(this, jsonObject, convertToCamel)
    }
}
