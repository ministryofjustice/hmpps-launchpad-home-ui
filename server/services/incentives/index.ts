import { IncentiveReviewSummary } from '../../@types/incentivesApiTypes'
import { HmppsAuthClient, IncentivesApiClient, RestClientBuilder } from '../../data'

export default class IncentivesService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly incentivesApiClientFactory: RestClientBuilder<IncentivesApiClient>,
  ) {}

  async getIncentivesSummaryFor(user: { idToken: { booking: { id: string } } }): Promise<IncentiveReviewSummary> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const incentivesApiClient = this.incentivesApiClientFactory(token)
    const incentivesData = await incentivesApiClient.getIncentivesSummaryFor(user.idToken.booking.id)

    return incentivesData
  }
}
