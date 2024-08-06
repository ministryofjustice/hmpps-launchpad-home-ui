import { Request, Response, Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler'

import type { Services } from '../../services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
      return res.render('pages/remove-access', {
        data: {
          title: 'Remove Client Access',
        },
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    }),
  )

  return router
}
