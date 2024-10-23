import logger from '../../../../logger'
import { IncentiveReviewSummary } from '../../../@types/incentivesApiTypes'
import config, { ApiConfig } from '../../../config'
import RestClient from '../../restClient'

export default class IncentivesApiClient {
  public restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('incentivesApiClient', config.apis.incentives as ApiConfig, token)
  }

  async getIncentivesSummaryFor(bookingId: string): Promise<IncentiveReviewSummary | null> {
    try {
      return await this.restClient.get({
        path: `/incentive-reviews/booking/${bookingId}`,
      })
    } catch (error) {
      logger.error(`Error fetching incentive summary for bookingId: ${bookingId}`, error)
      return null
    }
  }
}
