import { formatDate } from 'date-fns'
import { Router, type RequestHandler } from 'express'

import { DateFormats } from '../../constants/date'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import type { Services } from '../../services'
import { getEstablishmentLinksData } from '../../utils/utils'

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res) => {
    const { user } = res.locals
    const eventsData = await services.prisonerProfileService.getPrisonerEventsSummary(user)
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
  })

  return router
}
