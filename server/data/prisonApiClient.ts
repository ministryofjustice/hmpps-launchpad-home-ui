import { EventsData, PrisonerEvent } from '../@types/launchpad'

export default class PrisonApiClient {
  token: string

  bookingId: string

  constructor(token: string) {
    this.token = token
  }

  async getEventsSummary(bookingId: string): Promise<EventsData> {
    this.bookingId = bookingId

    // temp data - THIS WILL BE REPLACED WITH HTTP REQUEST TO THE PRISON API ENDPOINT
    const prisonerEvents: PrisonerEvent[] = [
      {
        timeString: '8:30am to 11:45am',
        description: 'Event description',
        location: 'Event location',
      },
      {
        timeString: '1:45pm to 4:45pm',
        description: 'Event description',
        location: 'Event location',
      },
      {
        timeString: '6:30pm to 7:45pm',
        description: 'Event description',
        location: 'Event location',
      },
    ]

    const eventsData: EventsData = {
      isTomorrow: false,
      error: false,
      prisonerEvents,
    }

    return eventsData
  }
}
