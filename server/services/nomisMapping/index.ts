import logger from '../../../logger'
import { HmppsAuthClient, NomisMappingApiClient, RestClientBuilder } from '../../data'
import { formatLogMessage } from '../../utils/utils'

export default class NomisMappingService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly nomisMappingApiClientFactory: RestClientBuilder<NomisMappingApiClient>,
  ) {}

  async nomisToDpsLocation(locationId: number, prisonerId: string, agencyId: string) {
    logger.info(formatLogMessage(`Mapping NOMIS location ID to DPS location ID: ${locationId}`, prisonerId, agencyId))
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const nomisMappingApiClient = this.nomisMappingApiClientFactory(token)

    try {
      return await nomisMappingApiClient.nomisToDpsLocation(locationId, prisonerId, agencyId)
    } catch (error) {
      logger.error(
        formatLogMessage(`Error mapping NOMIS location ID to DPS location ID: ${locationId}`, prisonerId, agencyId),
        error,
      )
      throw new Error('Failed to map location ID')
    }
  }
}
