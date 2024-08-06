import { HmppsAuthClient, RestClientBuilder } from '../../data'
import LaunchpadAuthClient from '../../data/api/launchpadAuth/client'

export default class LaunchpadAuthService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly launchpadAuthClientFactory: RestClientBuilder<LaunchpadAuthClient>,
  ) {}

  private async getLaunchpadAuthClient(): Promise<LaunchpadAuthClient> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.launchpadAuthClientFactory(token)
  }

  async getApprovedClients(
    prisonId: string,
    accessToken: string,
  ): Promise<ReturnType<LaunchpadAuthClient['getApprovedClients']>> {
    const launchpadAuthClient = await this.getLaunchpadAuthClient()
    return launchpadAuthClient.getApprovedClients(prisonId, accessToken)
  }

  async removeClientAccess(
    clientId: string,
    userId: string,
    accessToken: string,
  ): Promise<ReturnType<LaunchpadAuthClient['removeClientAccess']>> {
    const launchpadAuthClient = await this.getLaunchpadAuthClient()
    return launchpadAuthClient.removeClientAccess(clientId, userId, accessToken)
  }
}
