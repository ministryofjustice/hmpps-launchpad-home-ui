import { format } from 'date-fns'

import logger from '../../../logger'

import { DateFormats } from '../../constants/date'

import { Account, VisitBalances } from '../../@types/prisonApiTypes'
import { HmppsAuthClient, PrisonApiClient, RestClientBuilder } from '../../data'
import Timetable from '../../data/timetable'

export default class PrisonService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonApiClientFactory: RestClientBuilder<PrisonApiClient>,
  ) {}

  async getPrisonerEventsSummary(bookingId: string, language: string, prisonerId: string, agencyId: string) {
    logger.info(`Fetching prisoner events summary for bookingId: ${bookingId}`, { prisonerId, agencyId })
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return await prisonApiClient.getEventsSummary(bookingId, language, prisonerId, agencyId)
    } catch (error) {
      logger.error(`Error fetching prisoner events summary for bookingId: ${bookingId}`, {
        prisonerId,
        agencyId,
        error,
      })
      throw new Error('Failed to fetch prisoner events summary')
    }
  }

  async getEventsFor(
    bookingId: string,
    fromDate: Date,
    toDate: Date,
    language: string,
    prisonerId: string,
    agencyId: string,
  ) {
    logger.info(`Fetching events for bookingId: ${bookingId} from ${fromDate} to ${toDate}`, { prisonerId, agencyId })
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      const eventsData = await prisonApiClient.getEventsFor(bookingId, fromDate, toDate, prisonerId, agencyId)
      const timetableData = Timetable.create({ fromDate, toDate, language }).addEvents(language, eventsData).build()
      return timetableData.events
    } catch (error) {
      logger.error(`Error fetching events for bookingId: ${bookingId} from ${fromDate} to ${toDate}`, {
        prisonerId,
        agencyId,
        error,
      })
      throw new Error('Failed to fetch events data')
    }
  }

  async getEventsForToday(
    bookingId: string,
    language: string,
    prisonerId: string,
    agencyId: string,
    today: Date = new Date(),
  ) {
    try {
      logger.info(`Fetching today's events for bookingId: ${bookingId} on ${today}`, { prisonerId, agencyId })
      const results = await this.getEventsFor(bookingId, today, today, language, prisonerId, agencyId)
      return results[format(today, DateFormats.ISO_DATE)]
    } catch (error) {
      logger.error(`Error fetching today's events for bookingId: ${bookingId} on ${today}`, {
        prisonerId,
        agencyId,
        error,
      })
      throw new Error("Failed to fetch today's events")
    }
  }

  async getUserById(userId: string, prisonerId: string, agencyId: string) {
    logger.info(`Fetching user by ID: ${userId}`, { prisonerId, agencyId })
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return await prisonApiClient.getUserById(userId, prisonerId, agencyId)
    } catch (error) {
      logger.error(`Error fetching user by ID: ${userId}`, { prisonerId, agencyId, error })
      throw new Error('Failed to fetch user data')
    }
  }

  async getTransactions(prisonerId: string, accountCode: string, fromDate: Date, toDate: Date, agencyId: string) {
    logger.info(
      `Fetching transactions for userId: ${prisonerId}, accountCode: ${accountCode}, fromDate: ${fromDate}, toDate: ${toDate}`,
      { prisonerId, agencyId },
    )
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return await prisonApiClient.getTransactionsForDateRange(prisonerId, accountCode, fromDate, toDate, agencyId)
    } catch (error) {
      logger.error(
        `Error fetching transactions for userId: ${prisonerId}, accountCode: ${accountCode}, fromDate: ${fromDate}, toDate: ${toDate}`,
        { prisonerId, agencyId, error },
      )
      throw new Error('Failed to fetch transactions')
    }
  }

  async getBalances(bookingId: string, prisonerId: string, agencyId: string): Promise<Account> {
    logger.info(`Fetching balances for bookingId: ${bookingId}`, { prisonerId, agencyId })

    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    return prisonApiClient.getBalances(bookingId, prisonerId, agencyId)
  }

  async getPrisonsByAgencyType(type: string, prisonerId: string, agencyId: string) {
    logger.info(`Fetching prisons by agency type: ${type}`, { prisonerId, agencyId })
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return await prisonApiClient.getPrisonsByAgencyType(type, prisonerId, agencyId)
    } catch (error) {
      logger.error(`Error fetching prisons by agency type: ${type}`, { prisonerId, agencyId, error })
      throw new Error('Failed to fetch prisons by agency type')
    }
  }

  async getDamageObligations(prisonerId: string, agencyId: string) {
    logger.info(`Fetching damage obligations for userId: ${prisonerId}`, { prisonerId, agencyId })
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return await prisonApiClient.getDamageObligations(prisonerId, agencyId)
    } catch (error) {
      logger.error(`Error fetching damage obligations for userId: ${prisonerId}`, { prisonerId, agencyId, error })
      throw new Error('Failed to fetch damage obligations')
    }
  }

  async getNextVisit(bookingId: string, prisonerId: string, agencyId: string) {
    logger.info(`Fetching next visit for bookingId: ${bookingId}`, { prisonerId, agencyId })
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    return prisonApiClient.getNextVisit(bookingId, prisonerId, agencyId)
  }

  async getVisitBalances(prisonerId: string, agencyId: string): Promise<VisitBalances | null> {
    logger.info(`Fetching visit balances for prisonerId: ${prisonerId}`, { prisonerId, agencyId })
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    return prisonApiClient.getVisitBalances(prisonerId, agencyId)
  }
}
