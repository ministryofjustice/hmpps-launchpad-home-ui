import { TelemetryClient } from 'applicationinsights'
import CustomEventService, { Page } from './index'

jest.mock('applicationinsights')

describe('Metrics Service', () => {
  const telemetryClient = new TelemetryClient()
  const customEventService = new CustomEventService(telemetryClient)

  it('logPageView', () => {
    customEventService.logPageView(Page.HOME_PAGE, 'username', 'MDI')
    expect(telemetryClient.trackEvent).toHaveBeenCalledWith({
      name: 'PAGE_VIEW_HOME_PAGE',
      properties: {
        username: 'username',
        activeCaseLoadId: 'MDI',
      },
    })
  })
})
