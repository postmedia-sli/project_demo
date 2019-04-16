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

#### Analytics Targeting

To parse a click event and associated information **data-** is used:

    <a data-ana-evt-action="click" data-ana-evt-type="navigation" data-ana-evt-val='{"foo": "bar"'>Your Logo</a>

To parse a on page load event and associated information **data-** is used:

    <div data-ana-evt-action="page-load" data-ana-evt-type="widget-video-load" data-ana-evt-val='{"VideoID": "Video ID"}'></div>

- data-ana-evt-action - defines the type of event (click or on page load)
- data-ana-evt-type - defines the event should be triggered
- data-ana-evt-val - defines the data (**JSON object**) should be passed along with the event