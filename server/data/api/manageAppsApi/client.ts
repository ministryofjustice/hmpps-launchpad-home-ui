import logger from '../../../../logger'
import config, { ApiConfig } from '../../../config'
import RestClient from '../../restClient'

export default class ManageAppsClient {
  public restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('manageAppsClient', config.apis.manageApps as ApiConfig, token)
  }

  async getActiveAgencies(): Promise<string[]> {
    try {
      return await this.restClient.get({
        path: '/info',
      })
    } catch (error) {
      logger.error('Error fetching active manage apps establishments', error)
      throw new Error('Failed to fetch active manage apps establishments')
    }
  }
}
