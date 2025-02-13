import logger from '../../../logger'
import { HmppsAuthClient, NomisMappingApiClient, RestClientBuilder } from '../../data'

export default class NomisMappingService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly nomisMappingApiClientFactory: RestClientBuilder<NomisMappingApiClient>,
  ) {}

  async nomisToDpsLocation(locationId: number) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const nomisMappingApiClient = this.nomisMappingApiClientFactory(token)

    try {
      return await nomisMappingApiClient.nomisToDpsLocation(locationId)
    } catch (error) {
      logger.error(`Error mapping NOMIS location ID to DPS location ID: ${locationId}`, error)
      throw new Error('Failed to map location ID')
    }
  }
}
