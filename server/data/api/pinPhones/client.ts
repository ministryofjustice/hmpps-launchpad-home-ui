import logger from '../../../../logger'
import config, { ApiConfig } from '../../../config'
import RestClient from '../../restClient'

interface PhonPhonesInfoResponse {
  activeAgencies: string[]
}

export default class PhonPhonesClient {
  public restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('pinPhonesClient', config.apis.pinPhones as ApiConfig, token)
  }

  async getActiveAgencies(): Promise<string[]> {
    try {
      const response = await this.restClient.get<PhonPhonesInfoResponse>({
        path: '/info',
      })

      return response.activeAgencies
    } catch (error) {
      logger.error('Error fetching active manage apps establishments', error)
      return []
    }
  }
}
