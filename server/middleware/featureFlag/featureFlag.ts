import { NextFunction, Request, Response } from 'express'
import { ALLOW_ALL_PRISONS, featureFlags } from '../../constants/featureFlags'

// eslint-disable-next-line import/prefer-default-export
const featureFlagMiddleware = (flag: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const feature = featureFlags[flag]
    const prisonId = req.user?.idToken?.establishment?.agency_id

    if (
      !feature?.enabled ||
      (prisonId && feature.allowedPrisons !== ALLOW_ALL_PRISONS && !feature.allowedPrisons.includes(prisonId))
    ) {
      res.redirect('/profile')
      return
    }

    next()
  }
}

export default featureFlagMiddleware
