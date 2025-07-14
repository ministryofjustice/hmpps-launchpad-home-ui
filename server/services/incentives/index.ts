import { HmppsAuthClient, IncentivesApiClient, RestClientBuilder } from '../../data'
import logger from '../../../logger'

export default class IncentivesService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly incentivesApiClientFactory: RestClientBuilder<IncentivesApiClient>,
  ) {}

  async getIncentivesSummaryFor(bookingId: string, prisonerId: string, agencyId: string) {
    logger.info(`Fetching incentive summary for bookingId: ${bookingId}`, { prisonerId, agencyId })

    const token = await this.hmppsAuthClient.getSystemClientToken()
    const incentivesApiClient = this.incentivesApiClientFactory(token)

    return incentivesApiClient.getIncentivesSummaryFor(bookingId, prisonerId, agencyId)
  }
}
