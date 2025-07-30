import { Request, Response, Router } from 'express'
import { Features } from '../../constants/featureFlags'
import { asyncHandler } from '../../middleware/asyncHandler'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'
import { Services } from '../../services'
import { AUDIT_EVENTS, auditService } from '../../services/audit/auditService'

export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    featureFlagMiddleware(Features.Settings),
    asyncHandler(async (req: Request, res: Response) => {
      const { clientId, clientLogoUri, client } = req.query
      const { user } = res.locals

      const approvedClients = await services.launchpadAuthService.getApprovedClients(
        user.idToken.sub,
        user.idToken.establishment.agency_id,
        user.accessToken,
      )
      const validClient = approvedClients.content.find(c => c.id === clientId)

      if (!validClient) {
        req.flash('errors', 'Invalid client ID.')
        return res.redirect('/settings')
      }

      await auditService.audit({
        what: AUDIT_EVENTS.VIEW_REMOVE_APP_ACCESS,
        idToken: user.idToken,
        details: { clientId, client },
      })

      return res.render('pages/remove-access', {
        data: {
          userId: user.idToken.sub,
          clientId,
          clientLogoUri,
          client,
          accessToken: user.accessToken,
        },
        csrfToken: req.csrfToken(),
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    }),
  )

  router.post(
    '/',
    featureFlagMiddleware(Features.Settings),
    asyncHandler(async (req: Request, res: Response) => {
      const { userId, clientId, client, action } = req.body
      const { user } = res.locals

      const approvedClients = await services.launchpadAuthService.getApprovedClients(
        userId,
        user.idToken.establishment.agency_id,
        user.accessToken,
      )
      const validClient = approvedClients.content.find(c => c.id === clientId)

      if (!validClient) {
        req.flash('errors', 'Invalid client ID.')
        return res.redirect('/settings')
      }

      if (action === 'remove') {
        try {
          await auditService.audit({
            what: AUDIT_EVENTS.DELETE_APP_ACCESS,
            idToken: user.idToken,
            details: { clientId, client },
          })

          await services.launchpadAuthService.removeClientAccess(
            clientId,
            userId,
            user.idToken.establishment.agency_id,
            user.accessToken,
          )
          return res.redirect(`/settings?success=true&client=${client}`)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
