import { ApprovedClients } from '../../../@types/launchpad'
import config, { ApiConfig } from '../../../config'
import RestClient from '../../restClient'

export default class LaunchpadAuthClient {
  public readonly restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('launchpadAuthClient', config.apis.launchpadAuth as ApiConfig, token)
  }

  async getApprovedClients(prisonId: string, accessToken: string): Promise<ApprovedClients> {
    return this.restClient.get<ApprovedClients>({
      path: `/v1/users/${prisonId}/clients`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

  async removeClientAccess(clientId: string, userId: string, accessToken: string): Promise<void> {
    return this.restClient.delete<void>({
      path: `/v1/users/${userId}/clients/${clientId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }
}
