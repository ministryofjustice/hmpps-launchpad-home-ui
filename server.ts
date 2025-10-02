import 'applicationinsights'

import { app, metricsApp } from './server/index'
import logger from './logger'

const PORT = app.get('port')
const HOST = process.env.HOST || '0.0.0.0'

app.listen(PORT, HOST, () => {
  logger.info(`Server listening on http://${HOST}:${PORT}`)
})

metricsApp.listen(metricsApp.get('port'), () => {
  logger.info(`Metrics server listening on port ${metricsApp.get('port')}`)
})
