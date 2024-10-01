import logger from '../../../../logger'
import { PrisonerContact } from '../../../@types/prisonerContactRegistryApiTypes'
import config, { ApiConfig } from '../../../config'
import RestClient from '../../restClient'

export default class PrisonerContactRegistryApiClient {
  public restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient(
      'prisonerContactRegistryApiClient',
      config.apis.prisonerContactRegistry as ApiConfig,
      token,
    )
  }

  async getSocialVisitors(prisonerId: string): Promise<PrisonerContact[]> {
    try {
      return await this.restClient.get({
        path: `/prisoners/${prisonerId}/contacts?type=S`,
      })
    } catch (error) {
      logger.error(`Error fetching social visitors for prisonerId: ${prisonerId}`, error)
      throw new Error('Failed to fetch social visitors')
    }
  }
}
