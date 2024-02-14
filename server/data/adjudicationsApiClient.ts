import { HasAdjudicationsResponse } from '../@types/adjudicationsApiTypes'
import RestClient from './restClient'
import config, { ApiConfig } from '../config'

export default class AdjudicationsApiClient {
  private restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('adjudicationsApiClient', config.apis.adjudications as ApiConfig, token)
  }

  async hasAdjudications(bookingId: string): Promise<HasAdjudicationsResponse> {
    return (await this.restClient.get({
      path: `/adjudications/booking/${bookingId}/exists`,
    })) as HasAdjudicationsResponse
  }
}