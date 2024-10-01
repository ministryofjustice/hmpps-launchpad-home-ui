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

    try {
      return await prisonApiClient.getEventsSummary(bookingId)
    } catch (error) {
      logger.error(`Error fetching prisoner events summary for bookingId: ${bookingId}`, error)
      throw new Error('Unable to fetch prisoner events summary')
    }
  }

  async getEventsFor(bookingId: string, fromDate: Date, toDate: Date) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      const eventsData = await prisonApiClient.getEventsFor(bookingId, fromDate, toDate)
      const timetableData = Timetable.create({ fromDate, toDate }).addEvents(eventsData).build()
      return timetableData.events
    } catch (error) {
      logger.error(`Error fetching events for bookingId: ${bookingId} from ${fromDate} to ${toDate}`, error)
      throw new Error('Unable to fetch events data')
    }
  }

  async getEventsForToday(bookingId: string, today: Date = new Date()) {
    try {
      const results = await this.getEventsFor(bookingId, today, today)
      return results[format(today, DateFormats.ISO_DATE)]
    } catch (error) {
      logger.error(`Error fetching today's events for bookingId: ${bookingId} on ${today}`, error)
      throw new Error("Unable to fetch today's events")
    }
  }

  async getUserById(userId: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return await prisonApiClient.getUserById(userId)
    } catch (error) {
      logger.error(`Error fetching user by ID: ${userId}`, error)
      throw new Error('Unable to fetch user data')
    }
  }

  async getLocationById(locationId: number) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return await prisonApiClient.getLocationById(locationId)
    } catch (error) {
      logger.error(`Error fetching location by ID: ${locationId}`, error)
      throw new Error('Unable to fetch location data')
    }
  }

  async getTransactions(user: { idToken: { sub: string } }, accountCode: string, fromDate: Date, toDate: Date) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return await prisonApiClient.getTransactionsForDateRange(user.idToken.sub, accountCode, fromDate, toDate)
    } catch (error) {
      logger.error(
        `Error fetching transactions for userId: ${user.idToken.sub}, accountCode: ${accountCode}, fromDate: ${fromDate}, toDate: ${toDate}`,
        error,
      )
      throw new Error('Unable to fetch transactions')
    }
  }

  async getBalances(bookingId: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return await prisonApiClient.getBalances(bookingId)
    } catch (error) {
      logger.error(`Error fetching balances for bookingId: ${bookingId}`, error)
      throw new Error('Unable to fetch balances')
    }
  }

  async getPrisonsByAgencyType(type: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return await prisonApiClient.getPrisonsByAgencyType(type)
    } catch (error) {
      logger.error(`Error fetching prisons by agency type: ${type}`, error)
      throw new Error('Unable to fetch prisons by agency type')
    }
  }

  async getDamageObligations(user: { idToken: { sub: string } }) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return await prisonApiClient.getDamageObligations(user.idToken.sub)
    } catch (error) {
      logger.error(`Error fetching damage obligations for userId: ${user.idToken.sub}`, error)
      throw new Error('Unable to fetch damage obligations')
    }
  }

  async getNextVisit(bookingId: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return await prisonApiClient.getNextVisit(bookingId)
    } catch (error) {
      logger.error(`Error fetching next visit for bookingId: ${bookingId}`, error)
      throw new Error('Unable to fetch next visit data')
    }
  }
}
