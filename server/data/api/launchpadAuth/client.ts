import logger from '../../../../logger'
import { ApprovedClients } from '../../../@types/launchpad'
import config, { ApiConfig } from '../../../config'
import RestClient from '../../restClient'

export default class LaunchpadAuthClient {
  public readonly restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('launchpadAuthClient', config.apis.launchpadAuth as ApiConfig, token)
  }

  async getApprovedClients(userId: string, accessToken: string): Promise<ApprovedClients> {
    try {
      return await this.restClient.get<ApprovedClients>({
        path: `/v1/users/${userId}/clients`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } catch (error) {
      logger.error(`Error fetching approved clients for userId: ${userId}`, error)
      throw new Error('Failed to fetch approved clients')
    }
  }

  async removeClientAccess(clientId: string, userId: string, accessToken: string): Promise<void> {
    try {
      return await this.restClient.delete<void>({
        path: `/v1/users/${userId}/clients/${clientId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } catch (error) {
      logger.error(`Error removing client access for clientId: ${clientId}, userId: ${userId}`, error)
      throw new Error('Failed to remove client access')
    }
  }
}
