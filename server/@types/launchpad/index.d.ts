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

export type TimetableEvents = {
  [key: string]: TimetableRow
}

export type CalendarEventsData = {
  error: boolean
  prisonerEvents: ScheduledEvent[]
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
  prisonerContentHubURL: string
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

export type Establishment = {
  agencyId: string
  name: string
  displayName: string
  youth: boolean
  prisonerContentHubURL: string
  selfServiceURL: string
}

export type TimetableOptions = {
  fromDate: Date
  toDate: Date
}

export type TimetableSession = {
  finished: boolean
  events: TimetableEventFormatted[] // Updated to specify type
}

export type TimetableRow = {
  morning: TimetableSession
  afternoon: TimetableSession
  evening: TimetableSession
  title: string
}

export type NewTableRowOptions = {
  title: string
  hasDateElapsed: boolean
}

export type TimetableState = {
  events: TimetableEvents
  hasEvents: boolean
}

export type ProcessedDateSelection = {
  text: string
  value: string
  selected?: boolean
}

export type ProcesseSelectedTransactionDates = {
  dateSelection: ProcessedDateSelection[]
  fromDate: Date
  toDate: Date
}
