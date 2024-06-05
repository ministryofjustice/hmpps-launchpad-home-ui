import { Request, Response, NextFunction } from 'express'
import { featureFlags } from '../constants/featureFlags'

// eslint-disable-next-line import/prefer-default-export
const featureFlagMiddleware = (flag: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const feature = featureFlags[flag]
    const prisonId = req.user?.idToken?.establishment?.agency_id

    if (!feature || !feature.enabled || (prisonId && !feature.allowedPrisons.includes(prisonId))) {
      res.status(404).send('Feature not available')
      return
    }

    next()
  }
}

export default featureFlagMiddleware
