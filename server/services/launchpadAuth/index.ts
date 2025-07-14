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

  async getApprovedClients(prisonerId: string, agencyId: string, accessToken: string): Promise<ApprovedClients> {
    try {
      logger.info(`Fetching approved clients for prisonerId: ${prisonerId}`, { prisonerId, agencyId })
      const launchpadAuthClient = await this.getLaunchpadAuthClient()
      return await launchpadAuthClient.getApprovedClients(prisonerId, agencyId, accessToken)
    } catch (error) {
      logger.error(`Error fetching approved clients for prisonerId: ${prisonerId}`, { prisonerId, agencyId, error })
      throw new Error('Failed to fetch approved clients')
    }
  }

  async removeClientAccess(clientId: string, prisonerId: string, agencyId: string, accessToken: string): Promise<void> {
    try {
      logger.info(`Removing client access for clientId: ${clientId}, prisonerId: ${prisonerId}`, {
        prisonerId,
        agencyId,
      })
      const launchpadAuthClient = await this.getLaunchpadAuthClient()
      return await launchpadAuthClient.removeClientAccess(clientId, prisonerId, agencyId, accessToken)
    } catch (error) {
      logger.error(`Error removing client access for clientId: ${clientId}, prisonerId: ${prisonerId}`, {
        prisonerId,
        agencyId,
        error,
      })
      throw new Error('Failed to remove client access')
    }
  }
}
