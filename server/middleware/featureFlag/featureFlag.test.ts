import { NextFunction, Request, Response } from 'express'
import { featureFlags } from '../../constants/featureFlags'
import { user } from '../../utils/mocks/user'
import featureFlagMiddleware from './featureFlag'

jest.mock('../../constants/featureFlags', () => ({
  featureFlags: {
    visits: {
      enabled: true,
      allowedPrisons: ['CKI'],
    },
  },
}))

describe(featureFlagMiddleware.name, () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {
      user,
    }
    res = {
      redirect: jest.fn(),
    }
    next = jest.fn()
  })

  it('should call next if the feature is enabled and the prison is allowed', () => {
    const middleware = featureFlagMiddleware('visits')
    middleware(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should redirect to /profile if the feature is not enabled', () => {
    featureFlags.visits.enabled = false
    const middleware = featureFlagMiddleware('visits')
    middleware(req as Request, res as Response, next)

    expect(res.redirect).toHaveBeenCalledWith('/profile')
    expect(next).not.toHaveBeenCalled()
  })

  it('should redirect to /profile if the prison is not allowed', () => {
    req.user.idToken.establishment.agency_id = 'XYZ'
    const middleware = featureFlagMiddleware('visits')
    middleware(req as Request, res as Response, next)

    expect(res.redirect).toHaveBeenCalledWith('/profile')
    expect(next).not.toHaveBeenCalled()
  })

  it('should redirect to /profile if the feature does not exist', () => {
    const middleware = featureFlagMiddleware('nonexistentFeature')
    middleware(req as Request, res as Response, next)

    expect(res.redirect).toHaveBeenCalledWith('/profile')
    expect(next).not.toHaveBeenCalled()
  })

  it('should redirect to /profile if there is no prison ID', () => {
    req.user.idToken.establishment = null
    const middleware = featureFlagMiddleware('visits')
    middleware(req as Request, res as Response, next)

    expect(res.redirect).toHaveBeenCalledWith('/profile')
    expect(next).not.toHaveBeenCalled()
  })
})
