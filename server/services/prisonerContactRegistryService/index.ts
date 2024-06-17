import logger from '../../../logger'
import { HmppsAuthClient, PrisonerContactRegistryApiClient, RestClientBuilder } from '../../data'

export default class PrisonerContactRegistryService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonerContactRegistryApiClientFactory: RestClientBuilder<PrisonerContactRegistryApiClient>,
  ) {}

  async getSocialVisitors(prisonerId: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonerContactRegistryApiClient = this.prisonerContactRegistryApiClientFactory(token)

    try {
      return prisonerContactRegistryApiClient.getSocialVisitors(prisonerId)
    } catch (e) {
      logger.error('Failed to get social visitors for user', e)
      logger.debug(e.stack)
      return null
    }
  }
}
