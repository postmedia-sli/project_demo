/**
 * DOM related helper functions.
 */
export const DOMUtils = {
    /**
     * Loads javascript (https). To be used by vendor adapters only.
     *
     * @param src
     */
    loadScript(src: string): void {
        const el = document.createElement('script')
        el.setAttribute('src', src.replace(/^(?:https?:)?(.+)$/, 'https:$1'))
        document.body.appendChild(el)
    }
}
