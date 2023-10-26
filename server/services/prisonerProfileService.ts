import { HmppsAuthClient, RestClientBuilder, PrisonApiClient } from '../data'
import { EventsData } from '../@types/launchpad'

export default class PrisonerProfileService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonApiClientFactory: RestClientBuilder<PrisonApiClient>,
  ) {}

  async getPrisonerEventsSummary(user: { idToken: { booking: { id: string } } }): Promise<EventsData> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)
    const eventsSummary = await prisonApiClient.getEventsSummary(user.idToken.booking.id)
    return eventsSummary
  }
}
