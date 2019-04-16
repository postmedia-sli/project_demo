import { IAnalytics } from '../domain/analytics/i-analytics'
import { MParticle } from '../domain/analytics/providers/mparticle'
import { Event, IEvent } from '../domain/event/event'

export class AnalyticsService {

    public static ACTION_CLICK = 'click'
    public static ACTION_PAGE_LOAD = 'page-load'

    public static DOM = {
        attrs: {
            action: 'data-ana-evt-action',
            data: 'data-ana-evt-val',
            type: 'data-ana-evt-type'
        }
    }

    /**
     * Define all page load event types that can be handled
     */
    public static pageLoadEventTypes = {

        embeddedVideoLoadStory: 'embedded-video-load-story',
        errorMessageDisplayed: 'error-message-displayed',
        externalCampaign: 'external-campaign',
        outfitVideoPlayerLoad: 'outfit-video-player-load',
        search: 'search',
        videoCenter: 'video-center',
        viewArticle: 'view-article',
        viewCategory: 'view-category',
        viewPage: 'page-view',
        widgetPlaylistLoad: 'widget-playlist-load',
        widgetPlaylistPlayer: 'widget-playlist-player',
        widgetVideoLoad: 'widget-video-load',
    }

    /**
     * Define all click event types that can be handled
     */
    public static clickEventTypes = {
        navigation: 'navigation',
        videoFullScreen: 'video-full-screen',
        videoPause: 'video-pause',
        videoPlay: 'video-play',
        widget: 'widget'
    }

    private analytics: IAnalytics

    public initializeProvider(configuration: any): void {
        switch (configuration.analytics.provider.toLowerCase()) {
            case 'mparticle':
                this.analytics = new MParticle(configuration)
                this.analytics.initialize(configuration.analytics.providerSettings)
                this.analytics.bindEvents(this.getDocEvents())
                break
            default:
                // tslint:disable-next-line:no-console
                console.log('unknown analytics provider: ' + configuration.analytics.provider)
                break
        }
    }

    private getDocEvents(): IEvent[] {
        return [...document.querySelectorAll(`[${AnalyticsService.DOM.attrs.action}]`)]
            .map(
                (element: Element) => this.analytics.getEventByType(
                    element.getAttribute(AnalyticsService.DOM.attrs.type) || 'event',
                    element.getAttribute(AnalyticsService.DOM.attrs.data) || '',
                    element.getAttribute(AnalyticsService.DOM.attrs.action) || 'click',
                    element
                )
            )
    }
}
