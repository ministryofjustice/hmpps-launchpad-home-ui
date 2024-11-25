import { Request, Response, NextFunction } from 'express'
import { isFeatureEnabled } from '../utils/featureFlag/featureFlagUtils'
import { Features } from '../constants/featureFlags'

// eslint-disable-next-line import/prefer-default-export
export const setTranslationsEnabled = (req: Request, res: Response, next: NextFunction) => {
  const isTranslationsEnabled = isFeatureEnabled(Features.Translations, req.user.idToken.establishment.agency_id)
  const currentLng = req.query.lng || 'en'

  res.locals.isTranslationsEnabled = isTranslationsEnabled
  res.locals.currentLng = currentLng
  res.locals.translations = [
    { href: '/?lng=en', lang: 'en', text: 'English' },
    { href: '/?lng=cy', lang: 'cy', text: 'Cymraeg' },
  ]

  next()
}
