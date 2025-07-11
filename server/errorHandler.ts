import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../logger'
import { formatLogMessage } from './utils/utils'

export default function createErrorHandler(production: boolean) {
  return (error: HTTPError, req: Request, res: Response, next: NextFunction): void => {
    logger.error(
      formatLogMessage(`Error handling request for '${req.originalUrl}'`, res.locals.user?.idToken),
      production ? null : error,
    )

    res.locals.heading = 'Something went wrong'
    res.locals.subheading = 'This page could not be found.'
    res.locals.buttonText = 'Go back to home page'
    res.locals.buttonAttribute = 'go-back-to-homepage'
    res.locals.stack = production ? null : error.stack

    res.status(error.status || 500)

    return res.render('pages/error')
  }
}
