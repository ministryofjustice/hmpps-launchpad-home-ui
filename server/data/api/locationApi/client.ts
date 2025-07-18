import logger from '../../../../logger'
import { Location } from '../../../@types/locationInsidePrisonApiTypes'
import config, { ApiConfig } from '../../../config'
import RestClient from '../../restClient'
import { formatLogMessage } from '../../../utils/utils'

export default class LocationApiClient {
  public restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('locationApiClient', config.apis.location as ApiConfig, token)
  }

  async getLocationById(locationId: string, prisonerId: string, agencyId: string): Promise<Location> {
    try {
      return await this.restClient.get(
        {
          path: `/locations/${locationId}`,
        },
        prisonerId,
        agencyId,
      )
    } catch (error) {
      logger.error(
        formatLogMessage(`Error fetching location for locationId: ${locationId}`, prisonerId, agencyId),
        error,
      )
      throw new Error('Failed to fetch location')
    }
  }
}
