import { Request, Response, Router } from 'express'
import i18next from 'i18next'
import { DateFormats } from '../../constants/date'
import type { Services } from '../../services'
import { getEstablishmentData } from '../../utils/utils'
import { formatDateLocalized } from '../../utils/date/formatDateLocalized'
import { AUDIT_EVENTS, auditService } from '../../services/audit/auditService'
import config from '../../config'

export default function routes(services: Services): Router {
  const router = Router()

  router.get('/', async (req: Request, res: Response) => {
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

    await auditService.audit({ what: AUDIT_EVENTS.VIEW_HOMEPAGE, idToken: user.idToken })

    res.render('pages/homepage', {
      data: {
        title: 'Home',
        today: formatDateLocalized(new Date(), DateFormats.PRETTY_DATE, language),
        prisonerEventsSummary,
        homepageLinks,
        hideEventsSummaryAndProfileLinkTile: !showEventsSummaryAndProfileLinkTile(
          establishmentData?.hideHomepageEventsSummaryAndProfileLinkTile,
          req.user.idToken.sub,
        ),
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  return router
}

export const showEventsSummaryAndProfileLinkTile = (featureIsHiddenInConfig: boolean, prisonerId: string): boolean => {
  const allowedPrisoners = config.allowEventsAndProfileTileToPrisoners.split(',')
  return !featureIsHiddenInConfig || allowedPrisoners.includes(prisonerId)
}
