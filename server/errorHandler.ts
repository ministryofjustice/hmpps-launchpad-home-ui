import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../logger'

export default function createErrorHandler(production: boolean) {
  return (error: HTTPError, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`Error handling request for '${req.originalUrl}', user '${res.locals.user?.username}'`, error)

    if (error.status === 401 || error.status === 403) {
      logger.info('Logging user out')
      return res.redirect('/sign-out')
    }

    res.locals.pageNotFound = error.status === 404
    res.locals.heading = error.status === 404 ? 'Page not found' : 'Something went wrong'
    res.locals.buttonText = error.status === 302 ? 'Try again' : 'Go to the home page'
    res.locals.buttonAttribute = error.status === 302 ? 'try-again' : 'go-to-the-homepage'
    res.locals.stack = production ? null : error.stack

    res.status(error.status || 500)

    return res.render('pages/error')
  }
}
