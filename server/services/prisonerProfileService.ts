import { format } from 'date-fns'
import {
  HmppsAuthClient,
  RestClientBuilder,
  PrisonApiClient,
  IncentivesApiClient,
  AdjudicationsApiClient,
} from '../data'
import { EventsData, TimetableEvents, TimetableRow } from '../@types/launchpad'
import { IncentiveReviewSummary } from '../@types/incentivesApiTypes'
import { HasAdjudicationsResponse } from '../@types/adjudicationsApiTypes'
import Timetable from '../data/timetable'
import { DateFormats } from '../utils/enums'

export default class PrisonerProfileService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonApiClientFactory: RestClientBuilder<PrisonApiClient>,
    private readonly incentivesApiClientFactory: RestClientBuilder<IncentivesApiClient>,
    private readonly adjudicationsApiClientFactory: RestClientBuilder<AdjudicationsApiClient>,
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

  async getEventsForToday(
    user: { idToken: { booking: { id: string } } },
    today: Date = new Date(),
  ): Promise<TimetableRow> {
    const results = await this.getEventsFor(user, today, today)
    return results[format(today, DateFormats.ISO_DATE)]
  }

  async getIncentivesSummaryFor(user: { idToken: { booking: { id: string } } }): Promise<IncentiveReviewSummary> {
    const token = await this.hmppsAuthClient.getSystemClientToken() // dont do this on every request - do it once and store it in session
    const incentivesApiClient = this.incentivesApiClientFactory(token)
    const incentivesData = await incentivesApiClient.getIncentivesSummaryFor(user.idToken.booking.id)

    return incentivesData
  }

  async hasAdjudications(user: {
    idToken: { booking: { id: string }; establishment: { agency_id: string } }
  }): Promise<HasAdjudicationsResponse> {
    const token = await this.hmppsAuthClient.getSystemClientToken() // MAY NOT NEED TOKEN FOR THE NEW ADJUDICATIONS API - TO CONFIRM
    const adjudicationsApiClient = this.adjudicationsApiClientFactory(token)
    const userHasAdjudications = await adjudicationsApiClient.hasAdjudications(
      user.idToken.booking.id,
      user.idToken.establishment.agency_id,
    )

    return userHasAdjudications
  }

  // async getAdjudicationsFor(user: { idToken: { booking: { id: string } } }): Promise<IncentiveReviewSummary> {
  //   const token = await this.hmppsAuthClient.getSystemClientToken() // dont do this on every request - do it once and store it in session
  //   const prisonApiClient = this.prisonApiClientFactory(token)
  //   const adjudicationsData = await prisonApiClient.getAdjudicationsFor(user.idToken.booking.id)

  //   return adjudicationsData
  // }
}
