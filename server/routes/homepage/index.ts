import { type RequestHandler, Router } from 'express'
import { DateFormats } from '../../utils/enums'

import asyncMiddleware from '../../middleware/asyncMiddleware'

import type { Services } from '../../services'
import { formatDate, getEstablishmentLinksData } from '../../utils/utils'

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res) => {
    const { user } = res.locals
    const eventsData = await services.prisonerProfileService.getPrisonerEventsSummary(user)
    const linksData = await services.linksService.getHomepageLinks(user)
    const establishmentLinksData = getEstablishmentLinksData(user.idToken.establishment.agency_id)
    return res.render('pages/homepage', {
      errors: req.flash('errors'),
      message: req.flash('message'),
      today: formatDate(new Date(), DateFormats.PRETTY_DATE),
      eventsData,
      linksData,
      establishmentLinksData,
    })
  })

  return router
}
