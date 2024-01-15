import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../../middleware/asyncMiddleware'
import type { Services } from '../../services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res) => {
    const { given_name: givenName } = res.locals.user.idToken

    return res.render('pages/profile', {
      givenName,
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  return router
}
