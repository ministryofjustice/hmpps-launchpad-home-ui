import { HmppsAuthClient, RestClientBuilder, PrisonApiClient } from '../data'
import { EventsData, TimetableEvents } from '../@types/launchpad'
import Timetable from '../data/timetable'

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

  async getEventsFor(
    user: { idToken: { booking: { id: string } } },
    fromDate: Date,
    toDate: Date,
  ): Promise<TimetableEvents> {
    const token = await this.hmppsAuthClient.getSystemClientToken() // dont do this on every request - do it once and store it in session
    const prisonApiClient = this.prisonApiClientFactory(token)
    const eventsData = await prisonApiClient.getEventsFor(user.idToken.booking.id, fromDate, toDate)
    const timetableData = Timetable.create({ fromDate, toDate }).addEvents(eventsData).build()

    return timetableData.events
  }
}
