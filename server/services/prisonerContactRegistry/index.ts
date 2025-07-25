import logger from '../../../logger'
import { HmppsAuthClient, PrisonerContactRegistryApiClient, RestClientBuilder } from '../../data'
import { formatLogMessage } from '../../utils/utils'

export default class PrisonerContactRegistryService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonerContactRegistryApiClientFactory: RestClientBuilder<PrisonerContactRegistryApiClient>,
  ) {}

  async getSocialVisitors(prisonerId: string, agencyId: string) {
    try {
      logger.info(formatLogMessage(`Fetching social visitors for prisonerId: ${prisonerId}`, prisonerId, agencyId))
      const token = await this.hmppsAuthClient.getSystemClientToken()
      const prisonerContactRegistryApiClient = this.prisonerContactRegistryApiClientFactory(token)
      return await prisonerContactRegistryApiClient.getSocialVisitors(prisonerId, agencyId)
    } catch (error) {
      logger.error(
        formatLogMessage(`Error fetching social visitors for prisonerId: ${prisonerId}`, prisonerId, agencyId),
        error,
      )
      throw new Error('Failed to fetch social visitors')
    }
  }
}
