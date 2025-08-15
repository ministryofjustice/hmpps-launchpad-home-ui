import { format, Locale } from 'date-fns'
import { cy, enGB } from 'date-fns/locale'
import { Request, Response, Router } from 'express'
import i18next from 'i18next'
import * as z from 'zod'
import { DateFormats } from '../../constants/date'
import { Features } from '../../constants/featureFlags'
import featureFlagMiddleware from '../../middleware/featureFlag/featureFlag'
import { ApprovedClients } from '../../@types/launchpad'
import type { Services } from '../../services'
import { getPaginationData } from '../../utils/pagination/pagination'
import { AUDIT_EVENTS, auditService } from '../../services/audit/auditService'

export default function routes(services: Services): Router {
  const router = Router()

  const formatApprovedClients = (clients: ApprovedClients, language: string) => {
    const locales: Record<string, Locale> = { en: enGB, cy }
    const locale = locales[language] || enGB

    return clients.content.map(({ id, logoUri, name, createdDate, scopes, autoApprove }) => ({
      id,
      logoUri,
      name,
      accessSharedDate: format(createdDate, DateFormats.GDS_PRETTY_DATE, { locale }),
      permissions: scopes
        .filter(scope => scope?.humanReadable)
        .map(scope =>
          i18next.t(`settings.appAccess.permissions.${scope.type}`, scope.humanReadable, { lng: language }),
        ),
      autoApprove,
    }))
  }

  router.get('/', featureFlagMiddleware(Features.Settings), async (req: Request, res: Response) => {
    const { user } = res.locals
    const language = req.language || i18next.language

    const schema = z.object({
      page: z.coerce.number().int().min(1).optional(),
    })

    const query = schema.safeParse(req.query)

    if (!query.success) {
      return res.redirect('/settings')
    }

    const approvedClients = await services.launchpadAuthService.getApprovedClients(
      user.idToken.sub,
      user.idToken.establishment.agency_id,
      user.accessToken,
    )

    const formattedClients = formatApprovedClients(approvedClients, language)
    const paginationData = getPaginationData(query.data.page, formattedClients.length, 3)
    const paginatedClients = formattedClients.slice(paginationData.min - 1, paginationData.max)

    const data = {
      approvedClients: paginatedClients,
      paginationData,
      rawQuery: query.data,
    }

    await auditService.audit({
      what: AUDIT_EVENTS.VIEW_SETTINGS,
      idToken: user.idToken,
      details: {
        ...(query.data.page && { page: query.data.page }),
      },
    })

    return res.render('pages/settings', {
      data,
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  return router
}
