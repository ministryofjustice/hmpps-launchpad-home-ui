import logger from '../../../../logger'
import config, { ApiConfig } from '../../../config'
import RestClient from '../../restClient'

export default class NomisMappingApiClient {
  public restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('nomisMappingApiClient', config.apis.nomisMapping as ApiConfig, token)
  }

  async nomisToDpsLocation(locationId: number): Promise<{ dpsLocationId: string; nomisLocationId: string }> {
    try {
      return await this.restClient.get({
        path: `/api/locations/nomis/${locationId}`,
      })
    } catch (error) {
      logger.error(`Error mapping NOMIS location ID to DPS location ID: ${locationId}`, error)
      throw new Error('Failed to map location ID')
    }
  }
}
