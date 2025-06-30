import { TelemetryClient } from 'applicationinsights'

export enum Page {
  HOME_PAGE = 'HOME_PAGE',
}

export interface CustomEvent {
  name: string
  properties?: Record<string, string | number>
  measurements?: Record<string, number>
}

export default class UserAuditService {
  constructor(private readonly appInsightsClient: TelemetryClient) {}

  trackEvent(event: CustomEvent) {
    if (this.appInsightsClient) {
      this.appInsightsClient.trackEvent(event)
    }
  }

  logCustomEvent(auditEvent: CustomEvent) {
    this.trackEvent(auditEvent)
  }

  logPageView(page: Page, username: string, activeCaseLoadId: string) {
    const event: CustomEvent = {
      name: `PAGE_VIEW_${page}`,
      properties: {
        username,
        activeCaseLoadId,
      },
    }
    this.logCustomEvent(event)
  }
}
