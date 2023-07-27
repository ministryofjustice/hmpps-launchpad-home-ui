import type { Express } from 'express'
import request from 'supertest'
import * as cheerio from 'cheerio'
import { appWithAllRoutes } from '../testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  let UNILINK_URL: string
  let CONTENT_HUB_URL: string
  let NPR_URL: string
  let INSIDE_TIME_URL: string

  beforeEach(() => {
    UNILINK_URL = '#'
    CONTENT_HUB_URL = '#'
    NPR_URL = `${CONTENT_HUB_URL}/tags/785`
    INSIDE_TIME_URL = 'https://insidetimeprison.org/'
  })

  afterEach(() => {
    UNILINK_URL = ''
    CONTENT_HUB_URL = ''
    NPR_URL = ''
    INSIDE_TIME_URL = ''
  })

  it('should render the home page link tiles', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = cheerio.load(res.text)

        expect($('[data-test="tiles-panel"] .link-tile:nth-child(1) h3').text()).toBe('Unilink')
        expect($('[data-test="tiles-panel"] .link-tile:nth-child(1) a').attr('href')).toBe(UNILINK_URL)
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

        expect($('[data-test="tiles-panel"] .link-tile:nth-child(4) h3').text()).toBe('Inside Time')
        expect($('[data-test="tiles-panel"] .link-tile:nth-child(4) a').attr('href')).toBe(INSIDE_TIME_URL)
        expect($('[data-test="tiles-panel"] .link-tile:nth-child(4) p').text()).toBe(
          'Read the national newspaper for prisoners and detainees',
        )
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

  it('should render a profile link tile', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = cheerio.load(res.text)
        expect($('#internal-link-tile-profile a').attr('href')).toBe('/profile')
        expect($('#internal-link-tile-profile a h2').text()).toBe('Profile')
        expect($('#internal-link-tile-profile a p').text()).toBe(
          'Check money, visits, IEP, adjudications and timetable',
        )
      })
  })
})
