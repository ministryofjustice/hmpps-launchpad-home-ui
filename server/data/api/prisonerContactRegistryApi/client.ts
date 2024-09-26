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

  async getSocialVisitors(prisonerId: string) {
    return (await this.restClient.get({
      path: `/prisoners/${prisonerId}/contacts/social`,
    })) as PrisonerContact[]
  }
}
