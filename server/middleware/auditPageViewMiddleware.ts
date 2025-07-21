import { NextFunction, Request, Response } from 'express'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import config from '../config'
import { AUDIT_ACTIONS } from '../constants/audit'

const auditPageViewMiddleware = (pageName: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { idToken } = res.locals.user
    const agencyId = idToken.establishment?.agency_id
    const bookingId = idToken.booking.id
    const prisonerId = idToken.sub

    await auditService.sendAuditMessage({
      action: AUDIT_ACTIONS.VIEW_PAGE,
      who: prisonerId,
      service: config.apis.audit.serviceName,
      details: JSON.stringify({
        page: pageName,
        method: req.method,
        pageUrl: req.originalUrl,
        params: req.params,
        query: req.query,
        body: req.body,
        agencyId,
        bookingId,
      }),
    })

    next()
  }
}

export default auditPageViewMiddleware
