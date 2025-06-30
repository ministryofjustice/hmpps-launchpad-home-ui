import { TelemetryClient } from 'applicationinsights'

export enum Page {
  HOMEPAGE = 'Homepage',
}

export interface CustomEvent {
  name: string
  properties?: Record<string, string | number>
  measurements?: Record<string, number>
}

export default class CustomEventService {
  constructor(private readonly appInsightsClient: TelemetryClient) {}

  trackEvent(event: CustomEvent) {
    if (this.appInsightsClient) {
      this.appInsightsClient.trackEvent(event)
    }
  }

  logCustomEvent(customEvent: CustomEvent) {
    this.trackEvent(customEvent)
  }

  logPageView(page: Page, username: string, activeCaseLoadId: string) {
    const event: CustomEvent = {
      name: `LNP-Page-View-${page}`,
      properties: {
        username,
        activeCaseLoadId,
      },
    }
    this.logCustomEvent(event)
  }
}
