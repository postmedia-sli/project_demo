import { getGlobalCookie, setGlobalCookie } from './cookies'
import { registerPage } from './domain/page/page'
import { ConfigurationLoader } from './utils/configuration-loader'

const initPage = () => {
    document.addEventListener('DOMContentLoaded', () => {
        // load the page configuration
        const configuration = ConfigurationLoader.loadPageConfiguration('page-data')

        // register the configuration to the page, will trigger what it needs
        registerPage(configuration)
    })
}

// exporting here the functions you might use inline
export {getGlobalCookie, setGlobalCookie, initPage}
