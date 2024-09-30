import { IncentiveReviewSummary } from '../../../@types/incentivesApiTypes'
import RestClient from '../../restClient'
import config, { ApiConfig } from '../../../config'

export default class IncentivesApiClient {
  public restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('incentivesApiClient', config.apis.incentives as ApiConfig, token)
  }

  async getIncentivesSummaryFor(bookingId: string): Promise<IncentiveReviewSummary> {
    return this.restClient.get({
      path: `/incentive-reviews/booking/${bookingId}`,
    })
  }
}
