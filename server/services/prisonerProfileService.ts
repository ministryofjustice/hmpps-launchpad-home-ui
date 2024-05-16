import { format } from 'date-fns'
import logger from '../../logger'
import { IncentiveReviewSummary } from '../@types/incentivesApiTypes'
import { EventsData, TimetableEvents, TimetableRow } from '../@types/launchpad'
import { HmppsAuthClient, IncentivesApiClient, PrisonApiClient, RestClientBuilder } from '../data'
import Timetable from '../data/timetable'
import { DateFormats } from '../utils/enums'

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

  async getTransactions(user: { idToken: { sub: string } }, accountCode: string, fromDate: Date, toDate: Date) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return prisonApiClient.getTransactionsForDateRange(user.idToken.sub, accountCode, fromDate, toDate)
    } catch (e) {
      logger.error('Failed to get transactions for user', e)
      logger.debug(e.stack)
      return null
    }
  }

  async getBalances(bookingId: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return prisonApiClient.getBalances(bookingId)
    } catch (e) {
      logger.error('Failed to get balances for booking', e)
      logger.debug(e.stack)
      return null
    }
  }

  async getPrisonsByAgencyType(type: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return prisonApiClient.getPrisonsByAgencyType(type)
    } catch (e) {
      logger.error('Failed to get prisons by type', e)
      logger.debug(e.stack)
      return null
    }
  }
}
