import { EventsData, PrisonerEvent } from '../@types/launchpad'
import {
  Account,
  Agency,
  OffenderDamageObligation,
  OffenderTransactionHistoryDto,
  ScheduledEvent,
} from '../@types/prisonApiTypes'
import config, { ApiConfig } from '../config'
import { DateFormats } from '../utils/enums'
import { convertToTitleCase, formatDate, formatDateTimeString } from '../utils/utils'
import RestClient from './restClient'

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

  async getBalances(bookingId: string) {
    return (await this.restClient.get({
      path: `/api/bookings/${bookingId}/balances`,
    })) as Account
  }

  async getDamageObligations(prisonerId: string) {
    return (await this.restClient.get({
      path: `/api/offenders/${prisonerId}/damage-obligations`,
    })) as { damageObligations: OffenderDamageObligation[] }
  }

  async getPrisonsByAgencyType(type: string) {
    return (await this.restClient.get({
      path: `/api/agencies/type/${type}`,
    })) as Agency[]
  }

  async getTransactionsForDateRange(prisonerId: string, accountCode: string, fromDate: Date, toDate: Date) {
    return (await this.restClient.get({
      path: `/api/offenders/${prisonerId}/transaction-history?account_code=${accountCode}&from_date=${formatDate(fromDate, DateFormats.ISO_DATE)}&to_date=${formatDate(toDate, DateFormats.ISO_DATE)}`,
    })) as OffenderTransactionHistoryDto[]
  }
}
