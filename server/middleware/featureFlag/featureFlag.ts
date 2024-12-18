import { NextFunction, Request, Response } from 'express'
import { featureFlags } from '../../constants/featureFlags'

const featureFlagMiddleware = (flag: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const feature = featureFlags[flag]
    const prisonId = req.user?.idToken?.establishment?.agency_id

    if (!feature?.enabled || (prisonId && !feature.allowedPrisons.includes(prisonId))) {
      res.redirect('/profile')
      return
    }

    next()
  }
}

export default featureFlagMiddleware
