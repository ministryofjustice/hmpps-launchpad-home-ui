/* eslint-disable import/no-extraneous-dependencies */
import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import { NextFunction, Request, Response } from 'express'
import config from './config'

export function initSentry() {
  if (config.production) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [nodeProfilingIntegration()],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
    })
  }
}

export function sentryErrorHandler() {
  if (config.production) {
    return Sentry.expressErrorHandler()
  }

  return (err: unknown, req: Request, res: Response, next: NextFunction) => {
    next(err)
  }
}
