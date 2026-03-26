import { Request, Response } from 'express'
import { isFeatureEnabled } from '../utils/featureFlag/featureFlagUtils'
import { setUpLaunchpadHeader } from './setUpLaunchpadHeader'

jest.mock('../utils/featureFlag/featureFlagUtils')

describe('setUpLaunchpadHeader middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock

  beforeEach(() => {
    req = {
      query: {},
      user: {
        idToken: {
          name: 'TEST PRISONER',
          given_name: 'TEST',
          family_name: 'PRISONER',
          iat: 123456789,
          aud: '',
          sub: '',
          exp: 123456789,
          booking: { id: '' },
          establishment: {
            id: '',
            agency_id: 'CKI',
            name: '',
            display_name: '',
            youth: false,
          },
          iss: '',
        },
        refreshToken: '',
        accessToken: '',
        token: '',
      },
      language: 'en',
      get: jest.fn().mockImplementation((header: string) => {
        if (header === 'accept-language') {
          return 'en'
        }
        return null
      }),
    }
    res = {
      locals: {},
    }
    next = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('sets translations to be enabled when feature is enabled', () => {
    ;(isFeatureEnabled as jest.Mock).mockReturnValue(true)

    setUpLaunchpadHeader(req as Request, res as Response, next)

    expect(res.locals.launchpadHeaderConfig.translations.enabled).toBe(true)
    expect(next).toHaveBeenCalled()
  })

  it('sets translations to be disabled when feature is disabled', () => {
    ;(isFeatureEnabled as jest.Mock).mockReturnValue(false)

    setUpLaunchpadHeader(req as Request, res as Response, next)

    expect(res.locals.launchpadHeaderConfig.translations.enabled).toBe(false)
    expect(next).toHaveBeenCalled()
  })

  it('sets currentLanguageCode to the value from the query string if provided', () => {
    req.language = 'cy'
    ;(isFeatureEnabled as jest.Mock).mockReturnValue(true)

    setUpLaunchpadHeader(req as Request, res as Response, next)

    expect(res.locals.launchpadHeaderConfig.translations.currentLanguageCode).toBe('cy')
    expect(res.locals.launchpadHeaderConfig.translations.enabled).toBe(true)
    expect(next).toHaveBeenCalled()
  })

  it('sets currentLanguageCode to "en" if no query string is provided', () => {
    req.language = undefined
    ;(isFeatureEnabled as jest.Mock).mockReturnValue(true)

    setUpLaunchpadHeader(req as Request, res as Response, next)

    expect(res.locals.launchpadHeaderConfig.translations.currentLanguageCode).toBe('en')
    expect(res.locals.launchpadHeaderConfig.translations.enabled).toBe(true)
    expect(next).toHaveBeenCalled()
  })

  it('always calls next function', () => {
    ;(isFeatureEnabled as jest.Mock).mockReturnValue(true)

    setUpLaunchpadHeader(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
  })
})
