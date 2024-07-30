import { ApprovedClients } from '../../../@types/launchpad'
import config, { ApiConfig } from '../../../config'
import RestClient from '../../restClient'

export default class LaunchpadAuthClient {
  public restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('launchpadAuthClient', config.apis.launchpadAuth as ApiConfig, token)
  }

  async getApprovedClients(prisonId: string, accessToken: string) {
    return (await this.restClient.get({
      path: `/v1/users/${prisonId}/clients`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })) as ApprovedClients
  }
}
