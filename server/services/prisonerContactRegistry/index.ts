import logger from '../../../logger'
import { HmppsAuthClient, PrisonerContactRegistryApiClient, RestClientBuilder } from '../../data'

export default class PrisonerContactRegistryService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonerContactRegistryApiClientFactory: RestClientBuilder<PrisonerContactRegistryApiClient>,
  ) {}

  async getSocialVisitors(prisonerId: string) {
    try {
      const token = await this.hmppsAuthClient.getSystemClientToken()
      const prisonerContactRegistryApiClient = this.prisonerContactRegistryApiClientFactory(token)
      return await prisonerContactRegistryApiClient.getSocialVisitors(prisonerId)
    } catch (error) {
      logger.error(`Error fetching social visitors for prisonerId: ${prisonerId}`, error)
      throw new Error('Failed to fetch social visitors')
    }
  }
}
