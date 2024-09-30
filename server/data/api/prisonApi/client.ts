import { formatDate } from 'date-fns'
import { EventsData, PrisonerEvent } from '../../../@types/launchpad'
import {
  Account,
  Agency,
  OffenderDamageObligation,
  OffenderTransactionHistoryDto,
  ScheduledEvent,
  VisitDetails,
} from '../../../@types/prisonApiTypes'
import config, { ApiConfig } from '../../../config'
import { DateFormats } from '../../../constants/date'
import { convertToTitleCase, formatDateTimeString } from '../../../utils/utils'
import RestClient from '../../restClient'

export default class PrisonApiClient {
  public restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('prisonApiClient', config.apis.prison as ApiConfig, token)
  }

  async getEventsSummary(bookingId: string): Promise<EventsData> {
    const scheduledEvents: ScheduledEvent[] = await this.restClient.get({
      path: `/api/bookings/${bookingId}/events/today`,
      query: new URLSearchParams({ activeRestrictionsOnly: 'true' }).toString(),
    })

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
    return this.restClient.get({
      path: `/api/bookings/${bookingId}/events`,
      query: new URLSearchParams({
        fromDate: formatDate(fromDate, DateFormats.ISO_DATE),
        toDate: formatDate(toDate, DateFormats.ISO_DATE),
      }).toString(),
    })
  }

  async getReportedAdjudication(offenderNo: string, adjudicationNo: string) {
    return this.restClient.get({
      path: `/api/offenders/${offenderNo}/adjudications/${adjudicationNo}`,
    })
  }

  async getUserById(userId: string) {
    return this.restClient.get({
      path: `/api/users/${userId}`,
    })
  }

  async getLocationById(locationId: number) {
    return this.restClient.get({
      path: `/api/locations/${locationId}`,
    })
  }

  async getBalances(bookingId: string): Promise<Account> {
    return this.restClient.get({
      path: `/api/bookings/${bookingId}/balances`,
    })
  }

  async getDamageObligations(prisonerId: string): Promise<{ damageObligations: OffenderDamageObligation[] }> {
    return this.restClient.get({
      path: `/api/offenders/${prisonerId}/damage-obligations`,
    })
  }

  async getPrisonsByAgencyType(type: string): Promise<Agency[]> {
    return this.restClient.get({
      path: `/api/agencies/type/${type}`,
    })
  }

  async getTransactionsForDateRange(
    prisonerId: string,
    accountCode: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<OffenderTransactionHistoryDto[]> {
    return this.restClient.get({
      path: `/api/offenders/${prisonerId}/transaction-history?account_code=${accountCode}&from_date=${formatDate(fromDate, DateFormats.ISO_DATE)}&to_date=${formatDate(toDate, DateFormats.ISO_DATE)}`,
    })
  }

  async getNextVisit(bookingId: string): Promise<VisitDetails> {
    return this.restClient.get({
      path: `/api/bookings/${bookingId}/visits/next?withVisitors=true`,
    })
  }
}
