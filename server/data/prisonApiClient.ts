import { PageReportedAdjudicationDto } from '../@types/adjudicationsApiTypes'
import { EventsData, PrisonerEvent } from '../@types/launchpad'
import { ScheduledEvent } from '../@types/prisonApiTypes'
import config, { ApiConfig } from '../config'
import { formatDate, formatDateTimeString } from '../utils/date'
import { DateFormats } from '../utils/enums'
import { convertToTitleCase } from '../utils/utils'
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

  // async getAdjudicationFor(offenderNo: string, adjudicationNo: string) {
  //   return this.restClient.get({
  //     path: `/api/offenders/${offenderNo}/adjudications/${adjudicationNo}`,
  //   })
  // }
}
