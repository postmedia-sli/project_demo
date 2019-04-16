/**
 * Helper functions.
 */
export const CommonUtils = {
    /**
     * De-camalized a variable name
     *
     * @param str - string
     * @param separator - optional. Space ise used if not provided
     * @returns string
     */
    deCamelizedName(str: string, separator = ' '): string {
        if (str) {
            return str
                .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
                .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
        }
        return undefined
    },

    /**
     * Processes an element's value object
     * to be used as an event's parameter
     *
     * @param object
     * @returns object with de-camalized key name
     */
    processEventAttributes(obj: any): object {
        if (obj) {
            const eventAttributes: any = {}
            Object.keys(obj).forEach((key: string) => {
                const spacedKey = this.deCamelizedName(key)
                eventAttributes[spacedKey] = obj[key]
            })

            return eventAttributes
        }
        return undefined
    },

    /**
     * Generates a random alpha-numeric string for ids etc.
     *
     * @param {number} length of string
     * @return {string}
     */
    shortId(length = 6): string {
        const radix = 36
        return Math.random().toString(radix).slice(-length)
    }
}
