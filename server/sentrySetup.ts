import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import express from 'express'

const isProductionEnv = process.env.NODE_ENV === 'production'

export function initSentry() {
  if (isProductionEnv) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [nodeProfilingIntegration()],
      tracesSampleRate: 1.0,
      profileSessionSampleRate: 1.0,
    })
  }
}

export function sentryErrorHandler(app: express.Express) {
  if (isProductionEnv) {
    Sentry.setupExpressErrorHandler(app)
  }
}
