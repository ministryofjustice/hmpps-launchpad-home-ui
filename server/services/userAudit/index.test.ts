import { TelemetryClient } from 'applicationinsights'
import UserAuditService, { Page } from './index'

jest.mock('applicationinsights')

describe('Metrics Service', () => {
  const telemetryClient = new TelemetryClient()
  const userAuditService = new UserAuditService(telemetryClient)

  it('logPageView', () => {
    userAuditService.logPageView(Page.HOME_PAGE)
    expect(telemetryClient.trackEvent).toHaveBeenCalledWith({
      name: 'PAGE_VIEW_HOME_PAGE',
    })
  })
})
