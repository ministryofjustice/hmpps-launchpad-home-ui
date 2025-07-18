import logger from '../../../logger'
import { HmppsAuthClient, LocationApiClient, RestClientBuilder } from '../../data'
import { formatLogMessage } from '../../utils/utils'

export default class LocationService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly locationApiClientFactory: RestClientBuilder<LocationApiClient>,
  ) {}

  async getLocationById(locationId: string, prisonerId: string, agencyId: string) {
    logger.info(formatLogMessage(`Fetching location by ID: ${locationId}`, prisonerId, agencyId))
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const locationApiClient = this.locationApiClientFactory(token)

    try {
      return await locationApiClient.getLocationById(locationId, prisonerId, agencyId)
    } catch (error) {
      logger.error(formatLogMessage(`Error fetching location by ID: ${locationId}`, prisonerId, agencyId), error)
      throw new Error('Failed to fetch location data')
    }
  }
}
