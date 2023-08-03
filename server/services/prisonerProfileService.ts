import { HmppsAuthClient, RestClientBuilder, PrisonApiClient } from '../data'
import { EventsData } from '../@types/launchpad'

export default class PrisonerProfileService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonApiClientFactory: RestClientBuilder<PrisonApiClient>,
  ) {}

  async getPrisonerEventsSummary(bookingId: string): Promise<EventsData> {
    const prisonApiClient = new PrisonApiClient('TEMP_VALUE_THIS_LINE_WILL_BE_REPLACED')
    const eventsSummary = await prisonApiClient.getEventsSummary(bookingId)

    return eventsSummary
  }
}
