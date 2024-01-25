import { IncentiveReviewSummary } from '../@types/incentivesApiTypes'
import RestClient from './restClient'
import config, { ApiConfig } from '../config'

export default class IncentivesApiClient {
  private restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('incentivesApiClient', config.apis.incentives as ApiConfig, token)
  }

  async getIncentivesSummaryFor(bookingId: string): Promise<IncentiveReviewSummary> {
    return (await this.restClient.get({
      path: `/incentive-reviews/booking/${bookingId}`,
    })) as IncentiveReviewSummary
  }
}
