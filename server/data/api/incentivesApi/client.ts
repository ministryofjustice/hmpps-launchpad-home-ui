import logger from '../../../../logger'
import { IncentiveReviewSummary } from '../../../@types/incentivesApiTypes'
import config, { ApiConfig } from '../../../config'
import RestClient from '../../restClient'
import { formatLogMessage } from '../../../utils/utils'

export default class IncentivesApiClient {
  public restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('incentivesApiClient', config.apis.incentives as ApiConfig, token)
  }

  async getIncentivesSummaryFor(
    bookingId: string,
    prisonerId: string,
    agencyId: string,
  ): Promise<IncentiveReviewSummary | null> {
    try {
      return await this.restClient.get(
        {
          path: `/incentive-reviews/booking/${bookingId}`,
        },
        prisonerId,
        agencyId,
      )
    } catch (error) {
      logger.error(
        formatLogMessage(`Error fetching incentive summary for bookingId: ${bookingId}`, prisonerId, agencyId),
        error,
      )
      return null
    }
  }
}
