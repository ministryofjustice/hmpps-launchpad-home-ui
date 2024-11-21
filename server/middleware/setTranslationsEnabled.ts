import { Request, Response, NextFunction } from 'express'
import { isFeatureEnabled } from '../utils/featureFlag/featureFlagUtils'
import { Features } from '../constants/featureFlags'

// eslint-disable-next-line import/prefer-default-export
export const setTranslationsEnabled = (req: Request, res: Response, next: NextFunction) => {
  const isTranslationsEnabled = isFeatureEnabled(Features.Translations, req.user.idToken.establishment.agency_id)
  res.locals.isTranslationsEnabled = isTranslationsEnabled
  res.locals.currentLng = req.query.lng || 'en'
  next()
}
