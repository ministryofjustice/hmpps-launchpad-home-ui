import 'applicationinsights'

import { app, metricsApp } from './server/index'
import logger from './logger'

const PORT = app.get('port')
const METRICS_PORT = metricsApp.get('port')
const HOST = process.env.HOST || '0.0.0.0'

// Main  app binds to 0.0.0.0
app.listen(PORT, HOST, () => {
  logger.info(`Server listening on http://${HOST}:${PORT}`)
})

// Metrics app also binds to 0.0.0.0
metricsApp.listen(METRICS_PORT, HOST, () => {
  logger.info(`Metrics server listening on http://${HOST}:${METRICS_PORT}`)
})
