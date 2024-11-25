import { Request, Response, NextFunction } from 'express'
import { isFeatureEnabled } from '../utils/featureFlag/featureFlagUtils'
import { Features } from '../constants/featureFlags'

// eslint-disable-next-line import/prefer-default-export
export const setTranslationsEnabled = (req: Request, res: Response, next: NextFunction) => {
  const isTranslationsEnabled = isFeatureEnabled(Features.Translations, req.user.idToken.establishment.agency_id)
  const currentLng = req.language?.split('-')[0] || 'en'

  const buildHref = (lng: string) => {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
    url.searchParams.set('lng', lng)
    return url.toString()
  }

  res.locals.isTranslationsEnabled = isTranslationsEnabled
  res.locals.currentLng = currentLng
  res.locals.translations = [
    { href: buildHref('en'), lang: 'en', text: 'English' },
    { href: buildHref('cy'), lang: 'cy', text: 'Cymraeg' },
  ]

  next()
}
