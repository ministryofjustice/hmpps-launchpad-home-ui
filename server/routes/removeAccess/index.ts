import { Request, Response, Router } from 'express'
import i18next from 'i18next'
import * as z from 'zod'
import { Features } from '../../constants/featureFlags'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'
import { Services } from '../../services'
import { AUDIT_EVENTS, auditService } from '../../services/audit/auditService'

export default function routes(services: Services): Router {
  const router = Router()

  router.get('/', featureFlagMiddleware(Features.Settings), async (req: Request, res: Response) => {
    const { user } = res.locals

    const schema = z.object({
      clientId: z.uuid(),
    })

    const query = schema.safeParse(req.query)

    if (!query.success) {
      req.flash('errors', 'Invalid client ID')
      return res.redirect('/settings')
    }

    const approvedClients = await services.launchpadAuthService.getApprovedClients(
      user.idToken.sub,
      user.idToken.establishment.agency_id,
      user.accessToken,
    )
    const validClient = approvedClients.content.find(c => c.id === query.data.clientId)

    if (!validClient) {
      req.flash('errors', 'Invalid client ID')
      return res.redirect('/settings')
    }

    await auditService.audit({
      what: AUDIT_EVENTS.VIEW_REMOVE_APP_ACCESS,
      idToken: user.idToken,
      details: { clientId: query.data.clientId },
    })

    return res.render('pages/remove-access', {
      data: {
        userId: user.idToken.sub,
        clientId: query.data.clientId,
        clientLogoUri: validClient.logoUri,
        client: validClient.name,
      },
      csrfToken: req.csrfToken(),
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  router.post('/', featureFlagMiddleware(Features.Settings), async (req: Request, res: Response) => {
    const { user } = res.locals

    const schema = z.object({
      clientId: z.uuid(),
      action: z.enum(['remove', 'cancel']),
    })

    const body = schema.safeParse(req.body)

    if (!body.success) {
      req.flash('errors', 'Invalid client ID')
      return res.redirect('/settings')
    }

    const approvedClients = await services.launchpadAuthService.getApprovedClients(
      user.idToken.sub,
      user.idToken.establishment.agency_id,
      user.accessToken,
    )
    const validClient = approvedClients.content.find(c => c.id === body.data.clientId)

    if (!validClient) {
      req.flash('errors', 'Invalid client ID')
      return res.redirect('/settings')
    }

    if (body.data.action === 'remove') {
      try {
        const language = req.language || i18next.language

        await auditService.audit({
          what: AUDIT_EVENTS.DELETE_APP_ACCESS,
          idToken: user.idToken,
          details: { clientId: body.data.clientId },
        })

        await services.launchpadAuthService.removeClientAccess(
          body.data.clientId,
          user.idToken.sub,
          user.idToken.establishment.agency_id,
          user.accessToken,
        )

        req.flash('message', `${i18next.t('settings.appAccess.removedAccess', { lng: language })} ${validClient.name}`)
      } catch {
        req.flash('errors', 'Failed to remove access')
      }
    }

    return res.redirect('/settings')
  })

  return router
}
