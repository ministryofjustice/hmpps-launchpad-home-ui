import { HmppsAuthClient, RestClientBuilder } from '../../data'
import LaunchpadAuthClient from '../../data/api/launchpadAuth/client'

export default class LaunchpadAuthService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly launchpadAuthClientFactory: RestClientBuilder<LaunchpadAuthClient>,
  ) {}

  async getApprovedClients(prisonId: string, accessToken: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const launchpadAuthClient = this.launchpadAuthClientFactory(token)

    return launchpadAuthClient.getApprovedClients(prisonId, accessToken)
  }
}
