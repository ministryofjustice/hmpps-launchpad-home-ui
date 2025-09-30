// Require app insights before anything else to allow for instrumentation of bunyan and express
import 'applicationinsights'

import { app, metricsApp } from './server/index'
import logger from './logger'

app.listen(app.get('port'), '0.0.0.0', () => {
  logger.info(`Server listening on port ${app.get('port')} (bound to 0.0.0.0)`)
})

metricsApp.listen(metricsApp.get('port'), '0.0.0.0', () => {
  logger.info(`Metrics server listening on port ${metricsApp.get('port')} (bound to 0.0.0.0)`)
})
