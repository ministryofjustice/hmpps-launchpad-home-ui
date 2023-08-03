import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../../middleware/asyncMiddleware'

import type { Services } from '../../services'
import { formatDate } from '../../utils/utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res) => {
    const eventsData = await services.prisonerProfileService.getPrisonerEventsSummary(res.locals.user)
    const linksData = await services.linksService.getLinks()

    return res.render('pages/homepage', {
      errors: req.flash('errors'),
      message: req.flash('message'),
      today: formatDate(new Date()),
      eventsData,
      linksData,
    })
  })

  return router
}
