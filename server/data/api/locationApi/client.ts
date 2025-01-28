import logger from '../../../../logger'
import { Location } from '../../../@types/locationInsidePrisonApiTypes'
import config, { ApiConfig } from '../../../config'
import RestClient from '../../restClient'

export default class LocationApiClient {
  public restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('locationApiClient', config.apis.location as ApiConfig, token)
  }

  async getLocationById(locationId: string): Promise<Location> {
    try {
      return await this.restClient.get({
        path: `/locations/${locationId}`,
      })
    } catch (error) {
      logger.error(`Error fetching location for locationId: ${locationId}`, error)
      throw new Error('Failed to fetch location')
    }
  }
}
