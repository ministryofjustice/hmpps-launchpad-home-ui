import { format } from 'date-fns'

import logger from '../../../logger'

import { DateFormats } from '../../constants/date'

import { HmppsAuthClient, PrisonApiClient, RestClientBuilder } from '../../data'
import Timetable from '../../data/timetable'

export default class PrisonService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonApiClientFactory: RestClientBuilder<PrisonApiClient>,
  ) {}

  async getPrisonerEventsSummary(bookingId: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)
    const eventsSummary = await prisonApiClient.getEventsSummary(bookingId)
    return eventsSummary
  }

  async getEventsFor(bookingId: string, fromDate: Date, toDate: Date) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)
    const eventsData = await prisonApiClient.getEventsFor(bookingId, fromDate, toDate)
    const timetableData = Timetable.create({ fromDate, toDate }).addEvents(eventsData).build()

    return timetableData.events
  }

  async getEventsForToday(bookingId: string, today: Date = new Date()) {
    const results = await this.getEventsFor(bookingId, today, today)
    return results[format(today, DateFormats.ISO_DATE)]
  }

  async getUserById(userId: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)
    return prisonApiClient.getUserById(userId)
  }

  async getLocationById(locationId: number) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)
    return prisonApiClient.getLocationById(locationId)
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

  async getDamageObligations(user: { idToken: { sub: string } }) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return prisonApiClient.getDamageObligations(user.idToken.sub)
    } catch (e) {
      logger.error('Failed to get damage obligations for user', e)
      logger.debug(e.stack)
      return null
    }
  }

  async getNextVisit(bookingId: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return prisonApiClient.getNextVisit(bookingId)
    } catch (e) {
      logger.error('Failed to get next social visitor for user', e)
      logger.debug(e.stack)
      return null
    }
  }
}
