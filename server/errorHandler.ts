import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../logger'
import { formatLogMessage } from './utils/utils'
import { AUDIT_EVENTS, auditService } from './services/audit/auditService'

export default function createErrorHandler(production: boolean) {
  return async (error: HTTPError, req: Request, res: Response, next: NextFunction): Promise<void> => {
    logger.error(
      formatLogMessage(
        `Error handling request for '${req.originalUrl}', user '${res.locals.user?.idToken?.name}'`,
        res.locals.user?.idToken?.sub,
        res.locals.user?.idToken?.establishment?.agency_id,
      ),
      error,
    )

    await auditService.audit({
      what: AUDIT_EVENTS.ERROR_PAGE,
      idToken: res.locals.user?.idToken,
      details: { url: req.originalUrl, query: req.query },
    })

    res.locals.heading = 'Something went wrong'
    res.locals.subheading = 'This page could not be found.'
    res.locals.buttonText = 'Go back to home page'
    res.locals.buttonAttribute = 'go-back-to-homepage'
    res.locals.stack = production ? null : error.stack

    res.status(error.status || 500)

    return res.render('pages/error')
  }
}
