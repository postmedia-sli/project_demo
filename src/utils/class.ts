export class Class {

    /**
     * Will take in a string based class name (supports namespaces) and return the "function" that can be
     * used to construct the class. i.e.
     *
     * let cat:Cat = Class.make( 'my.package.name.Cat' );
     *
     * This method is handy if you don't exactly know the class you want to create at runtime. This case
     * often comes up in generic builders and factories.
     *
     * By default this function will instantiate the class for you (no constructor params); if you need to pass
     * in runtime constructor params then toggle the `instantiate` param to allow you to do so. i.e.
     *
     * @param buildClass
     * @param instantiate
     * @returns {Object}
     */
    public static make(buildClass: any, instantiate = true): object {
        if (typeof buildClass !== 'function') {
            throw new Error('Unable to locate class')
        }

        if (instantiate) {
            return new buildClass()
        } else {
            return buildClass
        }
    }
}
