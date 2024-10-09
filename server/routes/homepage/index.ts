import { formatDate } from 'date-fns'
import { Request, Response, Router } from 'express'

import { DateFormats } from '../../constants/date'
import { asyncHandler } from '../../middleware/asyncHandler'
import type { Services } from '../../services'
import { getEstablishmentLinksData } from '../../utils/utils'

export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
      const { user } = res.locals

      const eventsData = await services.prisonService.getPrisonerEventsSummary(user.idToken.booking.id)
      const linksData = await services.linksService.getHomepageLinks(user)
      const establishmentLinksData = getEstablishmentLinksData(user.idToken?.establishment?.agency_id)

      const hideHomepageEventsSummaryAndProfileLinkTile = establishmentLinksData
        ? establishmentLinksData.hideHomepageEventsSummaryAndProfileLinkTile
        : false

      return res.render('pages/homepage', {
        title: 'Home',
        errors: req.flash('errors'),
        message: req.flash('message'),
        today: formatDate(new Date(), DateFormats.PRETTY_DATE),
        eventsData,
        linksData,
        hideHomepageEventsSummaryAndProfileLinkTile,
      })
    }),
  )

  return router
}
