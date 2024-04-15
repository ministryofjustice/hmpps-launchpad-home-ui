import { EventsData, PrisonerEvent, AccountCode } from '../@types/launchpad'
import { ScheduledEvent, Agency, OffenderTransactionHistoryDto, Account } from '../@types/prisonApiTypes'
import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import { formatDate, formatDateTimeString, convertToTitleCase } from '../utils/utils'
import { DateFormats } from '../utils/enums'
import logger from '../../logger'

export default class PrisonApiClient {
  private restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('prisonApiClient', config.apis.prison as ApiConfig, token)
  }

  async getEventsSummary(bookingId: string): Promise<EventsData> {
    const scheduledEvents = (await this.restClient.get({
      path: `/api/bookings/${bookingId}/events/today`,
      query: new URLSearchParams({ activeRestrictionsOnly: 'true' }).toString(),
    })) as ScheduledEvent[]

    const prisonerEvents: PrisonerEvent[] = []

    scheduledEvents.forEach(scheduledEvent => {
      const prisonerEvent: PrisonerEvent = {
        timeString: formatDateTimeString(scheduledEvent.startTime, scheduledEvent.endTime, DateFormats.PRETTY_TIME),
        description: convertToTitleCase(scheduledEvent.eventSourceDesc),
        location: convertToTitleCase(scheduledEvent.eventLocation),
      }
      prisonerEvents.push(prisonerEvent)
    })

    const eventsData: EventsData = {
      isTomorrow: false,
      error: false,
      prisonerEvents,
    }

    return eventsData
  }

  async getEventsFor(bookingId: string, fromDate: Date, toDate: Date): Promise<ScheduledEvent[]> {
    return (await this.restClient.get({
      path: `/api/bookings/${bookingId}/events`,
      query: new URLSearchParams({
        fromDate: formatDate(fromDate, DateFormats.ISO_DATE),
        toDate: formatDate(toDate, DateFormats.ISO_DATE),
      }).toString(),
    })) as ScheduledEvent[]
  }

  async getTransactionsForDateRange(
    prisonerId: string,
    { accountCode, fromDate, toDate }: { accountCode: AccountCode; fromDate: Date; toDate: Date },
  ) {
    try {
      logger.info(`PrisonApiRepository (getTransactionsForDateRange) - User: ${prisonerId}`)

      return (await this.restClient.get({
        path: `/api/offenders/${prisonerId}/transaction-history`,
        query: new URLSearchParams({
          accountCode,
          fromDate: formatDate(fromDate, DateFormats.ISO_DATE),
          toDate: formatDate(toDate, DateFormats.ISO_DATE),
        }).toString(),
      })) as OffenderTransactionHistoryDto[]
    } catch (e) {
      logger.error(`PrisonApiRepository (getTransactionsForDateRange) - Failed: ${e.message} - User: ${prisonerId}`)
      logger.debug(e.stack)
      return null
    }
  }

  async getBalancesFor(bookingId: string) {
    try {
      logger.info(`PrisonApiRepository (getTransactionsForDateRange) - BookingId: ${bookingId}`)

      return (await this.restClient.get({
        path: `/api/bookings/${bookingId}/balances`,
      })) as Account
    } catch (e) {
      logger.error(`PrisonApiRepository (getBalancesFor) - Failed: ${e.message} - Booking ID: ${bookingId}`)
      logger.debug(e.stack)
      return null
    }
  }

  async getPrisonDetails(): Promise<Agency[]> {
    try {
      logger.info('PrisonApiRepository (getPrisonDetailsFor)')

      const prisonDetails = (await this.restClient.get({
        path: `/api/agencies/type/INST`,
        query: new URLSearchParams({ activeOnly: 'false' }).toString(),
      })) as Agency[]

      return prisonDetails
    } catch (e) {
      logger.error(`PrisonApiRepository (getPrisonDetailsFor) - Failed: ${e.message}`)
      logger.debug(e.stack)
      return null
    }
  }
}
