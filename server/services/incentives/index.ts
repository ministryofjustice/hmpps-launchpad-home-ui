import { HmppsAuthClient, IncentivesApiClient, RestClientBuilder } from '../../data'

export default class IncentivesService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly incentivesApiClientFactory: RestClientBuilder<IncentivesApiClient>,
  ) {}

  async getIncentivesSummaryFor(bookingId: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const incentivesApiClient = this.incentivesApiClientFactory(token)

    return incentivesApiClient.getIncentivesSummaryFor(bookingId)
  }
}
