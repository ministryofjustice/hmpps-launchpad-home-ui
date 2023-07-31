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
  title: string
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
