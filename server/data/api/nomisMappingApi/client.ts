import logger from '../../../../logger'
import config, { ApiConfig } from '../../../config'
import RestClient from '../../restClient'
import { formatLogMessage } from '../../../utils/utils'

export default class NomisMappingApiClient {
  public restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('nomisMappingApiClient', config.apis.nomisMapping as ApiConfig, token)
  }

  async nomisToDpsLocation(
    locationId: number,
    prisonerId: string,
    agencyId: string,
  ): Promise<{ dpsLocationId: string; nomisLocationId: string }> {
    try {
      return await this.restClient.get({
        path: `/api/locations/nomis/${locationId}`,
      })
    } catch (error) {
      logger.error(
        formatLogMessage(`Error mapping NOMIS location ID to DPS location ID: ${locationId}`, prisonerId, agencyId),
        error,
      )
      throw new Error('Failed to map location ID')
    }
  }
}
