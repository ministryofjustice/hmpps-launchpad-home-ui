import { stubFor } from './wiremock'

const activeAgenciesResponse = {
  activeAgencies: ['BWI', 'BFI'],
}

export default {
  // Feature flags endpoint - enable all features
  stubFeatureFlags: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/config/features.*',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          Adjudications: true,
          Transactions: true,
          Visits: true,
          SocialVisitors: true,
          Timetable: true,
          LearningAndSkills: true,
          MoneyAndDebt: true,
        },
      },
    }),

  stubExternalServiceInfo: () =>
    ['/manage-apps/info', '/pin-phone/info', '/content-hub/info', '/content-hub-legacy/info'].map(path =>
      stubFor({
        request: {
          method: 'GET',
          urlPattern: `${path}`,
        },
        response: {
          status: 200,
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          jsonBody: activeAgenciesResponse,
        },
      }),
    ),
}
