import { Request, Response, Router } from 'express'
import i18next from 'i18next'

import { DateFormats } from '../../constants/date'
import { asyncHandler } from '../../middleware/asyncHandler'
import type { Services } from '../../services'

import { getEstablishmentData } from '../../utils/utils'
import { formatDateLocalized } from '../../utils/date/formatDateLocalized'
import auditPageViewMiddleware from '../../middleware/auditPageViewMiddleware'
import { AUDIT_PAGE_NAMES } from '../../constants/audit'

export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    auditPageViewMiddleware(AUDIT_PAGE_NAMES.HOMEPAGE),
    asyncHandler(async (req: Request, res: Response) => {
      const { user } = res.locals
      const language = req.language || i18next.language

      const prisonerEventsSummary = await services.prisonService.getPrisonerEventsSummary(
        user.idToken.booking.id,
        language,
        user.idToken.sub,
        user.idToken.establishment.agency_id,
      )
      const homepageLinks = await services.linksService.getHomepageLinks(user, language)
      const establishmentData = getEstablishmentData(user.idToken?.establishment?.agency_id)

      res.render('pages/homepage', {
        data: {
          title: 'Home',
          today: formatDateLocalized(new Date(), DateFormats.PRETTY_DATE, language),
          prisonerEventsSummary,
          homepageLinks,
          hideEventsSummaryAndProfileLinkTile: establishmentData?.hideHomepageEventsSummaryAndProfileLinkTile || false,
        },
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    }),
  )

  return router
}
