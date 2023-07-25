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
    UNILINK_URL = null
    CONTENT_HUB_URL = null
    NPR_URL = null
    INSIDE_TIME_URL = null
  })

  it('should render the home page link tiles', () => {
    app = appWithAllRoutes({})

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
})
