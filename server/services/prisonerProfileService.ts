import { HmppsAuthClient, RestClientBuilder, PrisonApiClient } from '../data'
import { EventsData } from '../@types/launchpad'

export default class PrisonerProfileService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonApiClientFactory: RestClientBuilder<PrisonApiClient>,
  ) {}

  async getPrisonerEventsSummary(
    bookingId: string,
    //   {
    //   bookingId,
    //   username,
    // }: {
    //   bookingId: string
    //   username: string
    // }
  ): Promise<EventsData> {
    const prisonApiClient = new PrisonApiClient('TEMP_VALUE_THIS_LINE_WILL_BE_REPLACED')
    // const token = await this.hmppsAuthClient.getSystemClientToken(username) // this throws a 401 error
    // const prisonApiClient = this.prisonApiClientFactory(token)
    const eventsSummary = await prisonApiClient.getEventsSummary(bookingId)

    return eventsSummary
  }
}
