import { Request, Response, Router } from 'express'
import { asyncHandler } from '../../middleware/asyncHandler'
import { Services } from '../../services'

export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
      const { clientId, clientLogoUri, client } = req.query

      res.render('pages/remove-access', {
        data: {
          userId: res.locals.user.idToken.sub,
          clientId,
          clientLogoUri,
          client,
          accessToken: res.locals.user.accessToken,
        },
        csrfToken: req.csrfToken(),
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    }),
  )

  router.post(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
      const { userId, clientId, client, action } = req.body
      const { accessToken } = res.locals.user

      if (action === 'remove') {
        try {
          await services.launchpadAuthService.removeClientAccess(clientId, userId, accessToken)
          return res.redirect(`/settings?success=true&client=${client}`)
        } catch (error) {
          req.flash('errors', 'Failed to remove access.')
          return res.redirect('/settings?success=false')
        }
      }

      return res.redirect('/settings')
    }),
  )

  return router
}
