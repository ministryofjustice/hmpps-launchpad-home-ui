import { Request, Response, NextFunction } from 'express'
import { LanguageOption } from '@ministryofjustice/hmpps-prisoner-facing-components'
import { isFeatureEnabled } from '../utils/featureFlag/featureFlagUtils'
import { Features } from '../constants/featureFlags'

// eslint-disable-next-line import/prefer-default-export
export const setTranslationsEnabled = (req: Request, res: Response, next: NextFunction) => {
  const isTranslationsEnabled = isFeatureEnabled(Features.Translations, req.user?.idToken.establishment.agency_id)
  const currentLng = req.language?.split('-')[0] || 'en'

  const buildHref = (lng: string) => {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
    url.searchParams.set('lng', lng)
    return url.toString()
  }

  const translations: LanguageOption[] = [
    { href: buildHref('en'), code: 'en', label: 'English', isCurrent: currentLng === 'en' },
    { href: buildHref('cy'), code: 'cy', label: 'Cymraeg', isCurrent: currentLng === 'cy' },
  ]

  res.locals.isTranslationsEnabled = isTranslationsEnabled
  res.locals.currentLng = currentLng
  res.locals.translations = translations

  next()
}
