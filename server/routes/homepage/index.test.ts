import type { Express } from 'express'
import request from 'supertest'
import * as cheerio from 'cheerio'
import { appWithAllRoutes } from '../testutils/appSetup'
import { createMockPrisonService, createMockLinksService } from '../../services/testutils/mocks'
import { EventsData, PrisonerEvent, Link, LinksData } from '../../@types/launchpad'
import { getEstablishmentLinksData } from '../../utils/utils'

let app: Express

const prisonService = createMockPrisonService()
const linksService = createMockLinksService()
jest.mock('../../utils/utils', () => ({
  ...jest.requireActual('../../utils/utils'),
  getEstablishmentLinksData: jest.fn(),
}))

beforeEach(() => {
  app = appWithAllRoutes({
    services: { prisonService, linksService },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  let SELF_SERVICE_URL: string
  let CONTENT_HUB_URL: string
  let NPR_URL: string
  let INSIDE_TIME_URL: string
  let AGENCY_ID: string

  let prisonerEvents: PrisonerEvent[]
  let eventsData: EventsData
  let links: Link[]
  let linksData: LinksData

  beforeEach(() => {
    SELF_SERVICE_URL = 'PRISON_SPECIFIC_SELF_SERVICE_URL'
    CONTENT_HUB_URL = 'PRISON_SPECIFIC_URL'
    NPR_URL = `${CONTENT_HUB_URL}/tags/785`
    INSIDE_TIME_URL = 'https://insidetimeprison.org/'
    AGENCY_ID = 'PRISON_SPECIFIC_ID'

    prisonerEvents = [
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

    eventsData = {
      isTomorrow: false,
      error: false,
      prisonerEvents,
    }

    prisonService.getPrisonerEventsSummary.mockResolvedValue(eventsData)

    links = [
      {
        image: '/assets/images/link-tile-images/unilink-link-tile-image.png',
        title: 'Self-service',
        url: `${SELF_SERVICE_URL}`,
        description: 'Access to kiosk apps',
        openInNewTab: true,
        hidden: false,
      },
      {
        image: '/assets/images/link-tile-images/content-hub-link-tile-image.png',
        title: 'Content Hub',
        url: `${CONTENT_HUB_URL}`,
        description: 'Watch, read and listen to local and national content',
        openInNewTab: false,
        hidden: false,
      },
      {
        image: '/assets/images/link-tile-images/npr-link-tile-image.png',
        title: 'NPR',
        url: `${CONTENT_HUB_URL}/tags/785`,
        description: 'Listen to 24/7 music, talk, requests and playbacks',
        openInNewTab: true,
        hidden: false,
      },
      {
        image: '/assets/images/link-tile-images/inside-time-link-tile-image.png',
        title: 'Inside Time',
        url: 'https://insidetimeprison.org/',
        description: 'Read the national newspaper for prisoners and detainees',
        openInNewTab: true,
        hidden: true,
      },
    ]

    linksData = {
      links,
      prisonerContentHubURL: CONTENT_HUB_URL,
    }

    linksService.getHomepageLinks.mockResolvedValue(linksData)
  })

  afterEach(() => {
    SELF_SERVICE_URL = ''
    CONTENT_HUB_URL = ''
    NPR_URL = ''
    INSIDE_TIME_URL = ''
    prisonerEvents = []
    eventsData = {
      isTomorrow: false,
      error: false,
      prisonerEvents,
    }
    links = []
    linksData = {
      title: '',
      links,
      prisonerContentHubURL: '',
    }
    jest.clearAllMocks()
  })

  it('should render the homepage link tiles when hidden value is false', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = cheerio.load(res.text)

        expect($('[data-test="tiles-panel"] .link-tile:nth-child(1) h3').text()).toBe('Self-service')
        expect($('[data-test="tiles-panel"] .link-tile:nth-child(1) a').attr('href')).toBe(SELF_SERVICE_URL)
        expect($('[data-test="tiles-panel"] .link-tile:nth-child(1) p').text()).toBe('Access to kiosk apps')

        expect($('[data-test="tiles-panel"] .link-tile:nth-child(2) h3').text()).toBe('Content Hub')
        expect($('[data-test="tiles-panel"] .link-tile:nth-child(2) a').attr('href')).toBe(CONTENT_HUB_URL)
        expect($('[data-test="tiles-panel"] .link-tile:nth-child(2) p').text()).toBe(
          'Watch, read and listen to local and national content',
        )

        expect($('[data-test="tiles-panel"] .link-tile:nth-child(3) h3').text()).toBe('NPR')
        expect($('[data-test="tiles-panel"] .link-tile:nth-child(3) a').attr('href')).toBe(NPR_URL)
        expect($('[data-test="tiles-panel"] .link-tile:nth-child(3) p').text()).toBe(
          'Listen to 24/7 music, talk, requests and playbacks',
        )

        expect($('[data-test="tiles-panel"] .link-tile:nth-child(4) h3').text()).not.toBe('Inside Time')
        expect($('[data-test="tiles-panel"] .link-tile:nth-child(4) a').attr('href')).not.toBe(INSIDE_TIME_URL)
        expect($('[data-test="tiles-panel"] .link-tile:nth-child(4) p').text()).not.toBe(
          'Read the national newspaper for prisoners and detainees',
        )
      })
  })

  it('should display a title within the homepage link tiles component when the linksData object contains a title value', () => {
    linksData.title = 'A Tile Panel Title'

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = cheerio.load(res.text)
        expect($('[data-test="tiles-panel-title"]').text()).toBe('A Tile Panel Title')
      })
  })

  it('should render the home page events summary panel', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = cheerio.load(res.text)
        expect($('.events-summary h2').text()).toBe("Today's events")

        expect($('[data-test="event-detail-1"] .time').text()).toBe('8:30am to 11:45am')
        expect($('[data-test="event-detail-1"] .description').text()).toBe('Event description Event location')
        expect($('[data-test="event-detail-2"] .time').text()).toBe('1:45pm to 4:45pm')
        expect($('[data-test="event-detail-2"] .description').text()).toBe('Event description Event location')
        expect($('[data-test="event-detail-3"] .time').text()).toBe('6:30pm to 7:45pm')
        expect($('[data-test="event-detail-3"] .description').text()).toBe('Event description Event location')

        expect($('.events-summary a').text()).toBe('View my timetable')
        expect($('.events-summary a').attr('href')).toBe('/timetable')
      })
  })

  it('should render the home page events summary and profile link tile if hideHomepageEventsSummaryAndProfileLinkTile value is not present', () => {
    ;(getEstablishmentLinksData as jest.Mock).mockReturnValue({
      agencyId: AGENCY_ID,
      prisonerContentHubURL: CONTENT_HUB_URL,
      selfServiceURL: SELF_SERVICE_URL,
    })
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = cheerio.load(res.text)
        expect($('#events-summary-wrapper h2').text()).toBe("Today's events")
        expect($('#events-summary-wrapper a').attr('href')).toBe(`/timetable`)
        expect($('#events-summary-wrapper a').text()).toBe('View my timetable')
        expect($('#internal-link-tile-profile a').attr('href')).toBe(`${CONTENT_HUB_URL}/profile`)
        expect($('#internal-link-tile-profile a h2').text()).toBe('Profile')
        expect($('#internal-link-tile-profile a p').text()).toBe(
          'Check money, visits, IEP, adjudications and timetable',
        )
      })
  })

  it('should hide the home page events summary and  profile link tile if hideHomepageEventsSummaryAndProfileLinkTile value is true', () => {
    ;(getEstablishmentLinksData as jest.Mock).mockReturnValue({
      agencyId: AGENCY_ID,
      prisonerContentHubURL: CONTENT_HUB_URL,
      selfServiceURL: SELF_SERVICE_URL,
      hideHomepageEventsSummaryAndProfileLinkTile: true,
    })
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = cheerio.load(res.text)
        expect($('#events-summary-wrapper h2').text()).not.toBe("Today's events")
        expect($('#events-summary-wrapper a').attr('href')).not.toBe(`/timetable`)
        expect($('#events-summary-wrapper a').text()).not.toBe('View my timetable')
        expect($('#internal-link-tile-profile a').attr('href')).not.toBe(`${CONTENT_HUB_URL}/profile`)
        expect($('#internal-link-tile-profile a h2').text()).not.toBe('Profile')
        expect($('#internal-link-tile-profile a p').text()).not.toBe(
          'Check money, visits, IEP, adjudications and timetable',
        )
      })
  })

  it('should display the expected links in the page footer', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = cheerio.load(res.text)
        const firstLink = $('.govuk-footer ul li a').first()
        expect(firstLink.attr('href')).toBe(`${CONTENT_HUB_URL}/content/4856`)
        expect(firstLink.text().trim()).toBe('Privacy policy')
        expect(firstLink.attr('rel')).toBe('noreferrer noopener')
        expect(firstLink.attr('target')).toBe('_blank')
      })
  })
})
