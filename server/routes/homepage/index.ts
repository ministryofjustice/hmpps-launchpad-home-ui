import { Request, Response, Router } from 'express'
import i18next from 'i18next'

import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { DateFormats } from '../../constants/date'
import { asyncHandler } from '../../middleware/asyncHandler'
import type { Services } from '../../services'

import config from '../../config'
import { getEstablishmentData } from '../../utils/utils'
import { formatDateLocalized } from '../../utils/date/formatDateLocalized'

export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
      const { user } = res.locals
      const language = req.language || i18next.language

      await auditService.sendAuditMessage({
        action: 'VIEW_HOMEPAGE',
        who: user.idToken.sub,
        service: config.apis.audit.serviceName,
      })

      const prisonerEventsSummary = await services.prisonService.getPrisonerEventsSummary(
        user.idToken.booking.id,
        language,
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
