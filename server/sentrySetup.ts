/* eslint-disable import/no-extraneous-dependencies */
import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import { Request, Response, NextFunction } from 'express'

const isProductionEnv = process.env.NODE_ENV === 'production'

export function initSentry() {
  if (isProductionEnv) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [nodeProfilingIntegration()],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
    })
  }
}

export function sentryErrorHandler() {
  if (isProductionEnv) {
    return Sentry.expressErrorHandler()
  }

  return (err: unknown, req: Request, res: Response, next: NextFunction) => {
    next(err)
  }
}
