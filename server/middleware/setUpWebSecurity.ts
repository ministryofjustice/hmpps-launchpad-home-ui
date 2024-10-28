import crypto from 'crypto'
import express, { Router, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'

export default function setUpWebSecurity(): Router {
  const router = express.Router()

  router.use((_req: Request, res: Response, next: NextFunction) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
    next()
  })

  router.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            (_req: Request, res: Response) => `'nonce-${res.locals.cspNonce}'`,
            'https://*.googletagmanager.com',
            'https://js.sentry-cdn.com',
            'https://browser.sentry-cdn.com',
          ],
          styleSrc: ["'self'", (_req: Request, res: Response) => `'nonce-${res.locals.cspNonce}'`],
          fontSrc: ["'self'"],
          imgSrc: ["'self'", 'https://*.googletagmanager.com', 'https://*.google-analytics.com'],
          connectSrc: [
            "'self'",
            'https://*.googletagmanager.com',
            'https://*.google-analytics.com',
            'https://*.analytics.google.com',
            'https://*.ingest.us.sentry.io',
          ],
        },
      },
      crossOriginEmbedderPolicy: true,
    }),
  )

  return router
}
