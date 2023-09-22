export type RawPrisonerEvent = {
  bookingId: number
  eventClass: string
  eventId: number
  eventStatus: string
  eventType: string
  eventTypeDesc: string
  eventSubType: string
  eventSubTypeDesc: string
  eventDate: string
  startTime: string
  endTime: string
  eventLocation: string
  eventLocationId: number
  eventSource: string
  eventSourceCode: string
  eventSourceDesc: string
  paid: boolean
  payRate: number
  locationCode: string
}

export type PrisonerEvent = {
  timeString: string
  description: string
  location: string
}

export type EventsData = {
  isTomorrow: boolean
  error: boolean
  prisonerEvents: PrisonerEvent[]
}

export type Link = {
  image: string
  title: string
  url: string
  description: string
  openInNewTab: boolean
}

export type LinksData = {
  title?: string
  links: Link[]
}

export type Application = {
  details: {
    image: string
    name: string
  }
  sharing: string[]
  sharedOn: string
  status: string
}
