import { Configuration, IConfiguration } from '../domain/configuration'

export class ConfigurationLoader {

    /**
     * Load page configuration from the DOM and translate it to a Configuration object
     * @param pageAttribute
     */
    public static loadPageConfiguration(pageAttribute: string): IConfiguration {
        // retrieve the dom element
        const element = document.getElementById(pageAttribute)

        if (!element) {
            // tslint:disable-next-line:no-console
            console.log('Could not load configuration for pageAttribute: ' + pageAttribute)
        } else {
            return new Configuration(JSON.parse(element.innerHTML))
        }

        return undefined
    }
}
