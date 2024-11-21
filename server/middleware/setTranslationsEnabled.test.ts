import { Request, Response } from 'express'
import { isFeatureEnabled } from '../utils/featureFlag/featureFlagUtils'
import { setTranslationsEnabled } from './setTranslationsEnabled'

jest.mock('../utils/featureFlag/featureFlagUtils')

describe('setTranslationsEnabled middleware', () => {
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
    }
    res = {
      locals: {},
    }
    next = jest.fn()
  })

  it('should set isTranslationsEnabled to true when feature is enabled', () => {
    ;(isFeatureEnabled as jest.Mock).mockReturnValue(true)

    setTranslationsEnabled(req as Request, res as Response, next)

    expect(res.locals.isTranslationsEnabled).toBe(true)
    expect(next).toHaveBeenCalled()
  })

  it('should set isTranslationsEnabled to false when feature is disabled', () => {
    ;(isFeatureEnabled as jest.Mock).mockReturnValue(false)

    setTranslationsEnabled(req as Request, res as Response, next)

    expect(res.locals.isTranslationsEnabled).toBe(false)
    expect(next).toHaveBeenCalled()
  })

  it('should set currentLng to the value from the query string if provided', () => {
    req.query.lng = 'cy'
    ;(isFeatureEnabled as jest.Mock).mockReturnValue(true)

    setTranslationsEnabled(req as Request, res as Response, next)

    expect(res.locals.currentLng).toBe('cy')
    expect(res.locals.isTranslationsEnabled).toBe(true)
    expect(next).toHaveBeenCalled()
  })

  it('should set currentLng to "en" if no query string is provided', () => {
    req.query.lng = undefined
    ;(isFeatureEnabled as jest.Mock).mockReturnValue(true)

    setTranslationsEnabled(req as Request, res as Response, next)

    expect(res.locals.currentLng).toBe('en')
    expect(res.locals.isTranslationsEnabled).toBe(true)
    expect(next).toHaveBeenCalled()
  })

  it('should call next function regardless of feature flag status', () => {
    ;(isFeatureEnabled as jest.Mock).mockReturnValue(true)

    setTranslationsEnabled(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
  })
})
