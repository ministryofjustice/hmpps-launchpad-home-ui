import logger from '../../../logger'
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
    try {
      const launchpadAuthClient = await this.getLaunchpadAuthClient()
      return await launchpadAuthClient.getApprovedClients(userId, accessToken)
    } catch (error) {
      logger.error(`Error fetching approved clients for userId: ${userId}`, error)
      throw new Error('Failed to fetch approved clients')
    }
  }

  async removeClientAccess(clientId: string, userId: string, accessToken: string): Promise<void> {
    try {
      const launchpadAuthClient = await this.getLaunchpadAuthClient()
      return await launchpadAuthClient.removeClientAccess(clientId, userId, accessToken)
    } catch (error) {
      logger.error(`Error removing client access for clientId: ${clientId}, userId: ${userId}`, error)
      throw new Error('Failed to remove client access')
    }
  }
}
