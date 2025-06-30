import { TelemetryClient } from 'applicationinsights'
import CustomEventService, { Page } from './index'

jest.mock('applicationinsights')

describe('Metrics Service', () => {
  const telemetryClient = new TelemetryClient()
  const customEventService = new CustomEventService(telemetryClient)

  it('logPageView', () => {
    customEventService.logPageView(Page.HOMEPAGE, 'username', 'MDI')
    expect(telemetryClient.trackEvent).toHaveBeenCalledWith({
      name: 'LNP-Page-View-Homepage',
      properties: {
        username: 'username',
        activeCaseLoadId: 'MDI',
      },
    })
  })
})
