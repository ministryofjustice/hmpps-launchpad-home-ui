import logger from '../../../logger'
import { HmppsAuthClient, LocationApiClient, RestClientBuilder } from '../../data'

export default class LocationService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly locationApiClientFactory: RestClientBuilder<LocationApiClient>,
  ) {}

  async getLocationById(locationId: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const locationApiClient = this.locationApiClientFactory(token)

    try {
      return await locationApiClient.getLocationById(locationId)
    } catch (error) {
      logger.error(`Error fetching location by ID: ${locationId}`, error)
      throw new Error('Failed to fetch location data')
    }
  }
}
