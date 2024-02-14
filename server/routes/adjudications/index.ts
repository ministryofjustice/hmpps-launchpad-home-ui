import { type RequestHandler, Router } from 'express'
import { getEstablishmentLinksData } from '../../utils/utils'

import asyncMiddleware from '../../middleware/asyncMiddleware'
import type { Services } from '../../services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res) => {
    const { prisonerContentHubURL } = await getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id)

    const config = {
      content: false,
      header: false,
      postscript: true,
      detailsType: 'small',
      lastWeek: false,
      nextWeek: false,
    }

    return res.render('pages/adjudications', {
      givenName: res.locals.user.idToken.given_name,
      title: 'Adjudications',
      config,
      data: {
        adjudicationsReadMoreURL: `${prisonerContentHubURL}/content/4193`,
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  return router
}
