import superagent from 'superagent'
import logger from '../../../logger'

// eslint-disable-next-line import/prefer-default-export
export const ifWithinActiveAgency = async (
  agencyId: string,
  serviceUrl: string,
  activeAgenciesFetcher: ActiveAgenciesFetcher = activeAgenciesFrom,
): Promise<boolean> => {
  const activeAgencies = await activeAgenciesFetcher(serviceUrl)
  return activeAgencies !== undefined && (activeAgencies.includes(agencyId) || activeAgencies[0] === '***')
}

type ActiveAgenciesFetcher = (serviceUrl: string) => Promise<string[]>

const activeAgenciesFrom: ActiveAgenciesFetcher = serviceUrl =>
  new Promise<string[]>((resolve, _reject) => {
    superagent
      .get(`${serviceUrl}/info`)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err) {
          logger.error(`Unable to fetch activeAgencies from ${serviceUrl} - returning empty list`)
          return resolve([])
        }
        const { activeAgencies } = res.body
        if (activeAgencies === undefined) {
          logger.error(`Unable to fetch activeAgencies from ${serviceUrl} - returning empty list`)
          return resolve([])
        }
        return activeAgencies
      })
  })
