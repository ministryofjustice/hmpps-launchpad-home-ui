import { Router, type RequestHandler } from 'express'

import asyncMiddleware from '../../middleware/asyncMiddleware'

import { DateFormats } from '../../constants/date'
import type { Services } from '../../services'
import { formatDate } from '../../utils/utils'

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res) => {
    const { user } = res.locals
    const eventsData = await services.prisonerProfileService.getPrisonerEventsSummary(user)
    const linksData = await services.linksService.getHomepageLinks(user)

    return res.render('pages/homepage', {
      errors: req.flash('errors'),
      message: req.flash('message'),
      today: formatDate(new Date(), DateFormats.PRETTY_DATE),
      eventsData,
      linksData,
    })
  })

  return router
}
