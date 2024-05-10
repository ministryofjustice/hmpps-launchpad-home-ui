import { format } from 'date-fns'
import { IncentiveReviewSummary } from '../@types/incentivesApiTypes'
import { EventsData, TimetableEvents, TimetableRow } from '../@types/launchpad'
import { HmppsAuthClient, IncentivesApiClient, PrisonApiClient, RestClientBuilder } from '../data'
import Timetable from '../data/timetable'
import { DateFormats } from '../utils/enums'
import logger from '../../logger'
import { User } from '../data/hmppsAuthClient'

export default class PrisonerProfileService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonApiClientFactory: RestClientBuilder<PrisonApiClient>,
    private readonly incentivesApiClientFactory: RestClientBuilder<IncentivesApiClient>,
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

  async getTransactions(
    user: { idToken: { booking: { id: string } } },
    accountCode: string,
    fromDate: Date,
    toDate: Date,
  ) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      const transactions = prisonApiClient.getTransactionsForDateRange(
        user.idToken.booking.id,
        accountCode,
        fromDate,
        toDate,
      )

      return transactions
    } catch (e) {
      logger.error('Failed to get transactions for user', e)
      logger.debug(e.stack)
      return null
    }
  }
}
