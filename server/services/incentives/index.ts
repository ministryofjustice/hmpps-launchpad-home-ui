import logger from '../../../logger'
import { HmppsAuthClient, IncentivesApiClient, RestClientBuilder } from '../../data'

export default class IncentivesService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly incentivesApiClientFactory: RestClientBuilder<IncentivesApiClient>,
  ) {}

  async getIncentivesSummaryFor(bookingId: string) {
    try {
      const token = await this.hmppsAuthClient.getSystemClientToken()
      const incentivesApiClient = this.incentivesApiClientFactory(token)
      return await incentivesApiClient.getIncentivesSummaryFor(bookingId)
    } catch (error) {
      logger.error(`Error fetching incentive summary for bookingId: ${bookingId}`, error)
      throw new Error('Unable to fetch incentive summary')
    }
  }
}
