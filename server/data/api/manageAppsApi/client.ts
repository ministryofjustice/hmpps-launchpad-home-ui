import logger from '../../../../logger'
import config, { ApiConfig } from '../../../config'
import RestClient from '../../restClient'

interface ManageAppsInfoResponse {
  activeAgencies: string[]
}

export default class ManageAppsClient {
  public restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('manageAppsClient', config.apis.manageApps as ApiConfig, token)
  }

  async getActiveAgencies(): Promise<string[]> {
    try {
      const response = await this.restClient.get<ManageAppsInfoResponse>({
        path: '/info',
      })

      return response.activeAgencies
    } catch (error) {
      logger.error('Error fetching active manage apps establishments', error)
      return []
    }
  }
}
