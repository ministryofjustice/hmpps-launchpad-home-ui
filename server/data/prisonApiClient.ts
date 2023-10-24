import { EventsData, PrisonerEvent, RawPrisonerEvent } from '../@types/launchpad'
import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import { formatDateTimeString } from '../utils/utils'
import { DateFormats } from '../utils/enums'

export default class PrisonApiClient {
  private restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('prisonApiClient', config.apis.prison as ApiConfig, token)
  }

  async getEventsSummary(bookingId: string): Promise<EventsData> {
    const rawPrisonerEvents = (await this.restClient.get({
      path: `/api/bookings/${bookingId}/events/today`,
      query: new URLSearchParams({ activeRestrictionsOnly: 'true' }).toString(),
    })) as RawPrisonerEvent[]

    const prisonerEvents: PrisonerEvent[] = []

    rawPrisonerEvents.forEach(rawPrisonerEvent => {
      const prisonerEvent: PrisonerEvent = {
        timeString: formatDateTimeString(rawPrisonerEvent.startTime, rawPrisonerEvent.endTime, DateFormats.PRETTY_TIME), // update to format as in content hub - replicate functionality
        description: `${rawPrisonerEvent.eventSourceDesc}`, // update to format as in content hub - replicate functionality
        location: `${rawPrisonerEvent.eventLocation}`, // update to format as in content hub - replicate functionality
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
}
