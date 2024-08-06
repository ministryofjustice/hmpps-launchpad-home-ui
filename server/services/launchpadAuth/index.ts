import { ApprovedClients } from '../../@types/launchpad'
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

  async getApprovedClients(userId: string, accessToken: string): Promise<ApprovedClients> {
    const launchpadAuthClient = await this.getLaunchpadAuthClient()
    return launchpadAuthClient.getApprovedClients(userId, accessToken)
  }

  async removeClientAccess(clientId: string, userId: string, accessToken: string): Promise<void> {
    const launchpadAuthClient = await this.getLaunchpadAuthClient()
    return launchpadAuthClient.removeClientAccess(clientId, userId, accessToken)
  }
}
