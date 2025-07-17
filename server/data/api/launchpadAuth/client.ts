import logger from '../../../../logger'
import { ApprovedClients } from '../../../@types/launchpad'
import config, { ApiConfig } from '../../../config'
import RestClient from '../../restClient'
import { formatLogMessage } from '../../../utils/utils'

export default class LaunchpadAuthClient {
  public readonly restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('launchpadAuthClient', config.apis.launchpadAuth as ApiConfig, token)
  }

  async getApprovedClients(prisonerId: string, agencyId: string, accessToken: string): Promise<ApprovedClients> {
    try {
      return await this.restClient.get<ApprovedClients>({
        path: `/v1/users/${prisonerId}/clients`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } catch (error) {
      logger.error(
        formatLogMessage(`Error fetching approved clients for prisonerId: ${prisonerId}`, prisonerId, agencyId),
        error,
      )
      throw new Error('Failed to fetch approved clients')
    }
  }

  async removeClientAccess(clientId: string, prisonerId: string, agencyId: string, accessToken: string): Promise<void> {
    try {
      return await this.restClient.delete<void>({
        path: `/v1/users/${prisonerId}/clients/${clientId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } catch (error) {
      logger.error(
        formatLogMessage(
          `Error removing client access for clientId: ${clientId}, prisonerId: ${prisonerId}`,
          prisonerId,
          agencyId,
        ),
        error,
      )
      throw new Error('Failed to remove client access')
    }
  }
}
