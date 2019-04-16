# Usage

### Setup

This package is available to be loaded using JSON configuration and data attributes on DOM elements, depending on usage 
requirements.

#### Configuration

In your .html template, include a script tag in the head with the id `page-data`:

    <script type="application/json" id="page-data">
        {
            "analytics": {
                "provider": "mparticle",
                "providerSettings": {
                {
                    "workspace": {
                        "id": 1234,
                        "name": "Postmedia",
                        "key": "public-key-for-app",
                        "secret": "super-secret-key-for-app"
                    }
                }
            }
        }
    </script>

The example above would be used to initialize analytics tracking for the page.

    @todo - add page type configuration (ie. story / category etc.)
    
#### Ad Targeting

To load ads, data attributes can be added to elements in the DOM for loading.  For example:

    <div data-ad-slot="ad-loc-foo" data-ad-type="video"></div>
    
This allows you to control the styling and placement in your application template, but the library takes care of 
connecting to and loading the ad in place.

#### Analytics Targeting

    @todo - add documentation for analytics event targeting