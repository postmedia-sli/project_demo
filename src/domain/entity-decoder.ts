/**
 * A Entity object decoder to another format
 */
export class EntityDecoder {

    /**
     * Will convert an Entity based object JSON (deep nested)
     *
     * @param sourceObject
     * @param jsonObject
     * @param convertToCamel
     * @returns {T}
     */
    public static jsonDecode<T>(sourceObject: T, jsonObject: object, convertToCamel?: boolean): T {
        for (const key in jsonObject) {
            if (jsonObject.hasOwnProperty(key)) {
                const value: any = (jsonObject as any)[key]

                // don't copy these -- a class should build these objects internally
                if (typeof value === 'object' && !(value instanceof Array)) {
                    continue
                }

                // if we have an array, check if it contains objects; if so, skip those as well
                if (value instanceof Array && value.length > 0 && typeof value[0] === 'object') {
                    continue
                }

                const camelCase: string = convertToCamel ? EntityDecoder.toCamel(key) : key;

                // set the value
                (sourceObject as any)[camelCase] = value
            }
        }

        return sourceObject
    }

    /**
     * Will convert a string to camel case (my_property => myProperty)
     *
     * @param propertyName
     * @returns {string}
     */
    public static toCamel(propertyName: string): string {
        const str: string = propertyName.replace(/[\-_\s]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '')
        return (str.substr(0, 1)).toLowerCase() + str.substr(1)
    }
}
