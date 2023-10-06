import { EventsData, PrisonerEvent, RawPrisonerEvent } from '../@types/launchpad'
import RestClient from './restClient'
import config, { ApiConfig } from '../config'

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
        timeString: `${rawPrisonerEvent.startTime} to ${rawPrisonerEvent.endTime}`, // update to format as in content hub - replicate functionality
        description: `${rawPrisonerEvent.eventSourceDesc}`, // update to format as in content hub - replicate functionality
        location: `${rawPrisonerEvent.eventLocation}`, // update to format as in content hub - replicate functionality
      }
      prisonerEvents.push(prisonerEvent)
    })

    // temp data - THIS WILL BE REPLACED WITH HTTP REQUEST TO THE PRISON API ENDPOINT
    // const prisonerEvents: PrisonerEvent[] = [
    //   {
    //     timeString: '8:30am to 11:45am',
    //     description: 'Event description',
    //     location: 'Event location',
    //   },
    //   {
    //     timeString: '1:45pm to 4:45pm',
    //     description: 'Event description',
    //     location: 'Event location',
    //   },
    //   {
    //     timeString: '6:30pm to 7:45pm',
    //     description: 'Event description',
    //     location: 'Event location',
    //   },
    // ]

    const eventsData: EventsData = {
      isTomorrow: false,
      error: false,
      prisonerEvents,
    }

    return eventsData
  }
}
