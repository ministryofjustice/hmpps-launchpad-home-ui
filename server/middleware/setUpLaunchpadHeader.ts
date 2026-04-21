import { RequestHandler } from 'express'
import { isFeatureEnabled } from '../utils/featureFlag/featureFlagUtils'
import { Features } from '../constants/featureFlags'

// eslint-disable-next-line import/prefer-default-export
export const setUpLaunchpadHeader: RequestHandler = (req, res, next) => {
  const isTranslationsEnabled = isFeatureEnabled(Features.Translations, req.user?.idToken.establishment.agency_id)
  const currentLng = req.language?.split('-')[0] || 'en'

  const hrefOf = (code: string) => {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
    url.searchParams.set('lng', code)
    return url.toString()
  }

  res.locals.launchpadHeaderConfig = {
    user: { name: req.user?.name },
    translations: {
      enabled: isTranslationsEnabled,
      currentLanguageCode: currentLng,
      options: [
        { href: hrefOf('en'), code: 'en', label: 'English' },
        { href: hrefOf('cy'), code: 'cy', label: 'Cymraeg' },
      ],
    },
  }

  next()
}
