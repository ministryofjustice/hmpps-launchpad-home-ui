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

export type RefreshToken = {
  jti: string
  ati: string
  iat: number
  aud: string
  sub: string
  exp: number
  scopes: string[]
}

export type IdToken = {
  name: string
  given_name: string
  family_name: string
  nonce?: string
  iat: number
  aud: string
  sub: string
  exp: number
  booking: {
    id: string
  }
  establishment: {
    id: string
    agency_id: string
    name: string
    display_name: string
    youth: boolean
  }
  iss: string
}

export type UpdatedTokensResponse = {
  id_token: string
  refresh_token: string
  access_token: string
  token_type: string
  expires_in: number
}
