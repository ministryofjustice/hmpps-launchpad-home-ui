import logger from '../../../../logger'
import { PrisonerContact } from '../../../@types/prisonerContactRegistryApiTypes'
import config, { ApiConfig } from '../../../config'
import RestClient from '../../restClient'
import { formatLogMessage } from '../../../utils/utils'

export default class PrisonerContactRegistryApiClient {
  public restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient(
      'prisonerContactRegistryApiClient',
      config.apis.prisonerContactRegistry as ApiConfig,
      token,
    )
  }

  async getSocialVisitors(prisonerId: string, agencyId: string): Promise<PrisonerContact[]> {
    try {
      return await this.restClient.get(
        {
          path: `/prisoners/${prisonerId}/contacts/social`,
        },
        prisonerId,
        agencyId,
      )
    } catch (error) {
      logger.error(
        formatLogMessage(`Error fetching social visitors for prisonerId: ${prisonerId}`, prisonerId, agencyId),
        error,
      )
      throw new Error('Failed to fetch social visitors')
    }
  }
}
