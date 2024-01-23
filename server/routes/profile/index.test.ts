import type { Express } from 'express'
import request from 'supertest'
import * as cheerio from 'cheerio'
import { appWithAllRoutes } from '../testutils/appSetup'
import { createMockPrisonerProfileService, createMockLinksService } from '../../services/testutils/mocks'
import { TimetableEvents } from '../../@types/launchpad'
import { events } from '../testutils/data'

let app: Express

const prisonerProfileService = createMockPrisonerProfileService()
const linksService = createMockLinksService()

jest.mock('../../utils/utils', () => ({
  ...jest.requireActual('../../utils/utils'),
  getEstablishmentLinksData: jest.fn(() => ({
    prisonerContentHubURL: 'MOCKED_PRISONER_CONTENT_HUB_URL',
  })),
}))

beforeEach(() => {
  app = appWithAllRoutes({
    services: { prisonerProfileService, linksService },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /profile', () => {
  let eventsData: TimetableEvents

  beforeEach(() => {
    eventsData = events

    prisonerProfileService.getEventsFor.mockResolvedValue(eventsData)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Timetable', () => {
    it('should render the timetable sections as expected', () => {
      return request(app)
        .get('/profile')
        .expect('Content-Type', /html/)
        .expect(res => {
          const $ = cheerio.load(res.text)
          expect($('[data-test="timetable-container"] h2').text()).toBe("Today's timetable")
          expect($('[data-test="morningEvents"] h3').text()).toBe('Morning')
          expect($('[data-test="afternoonEvents"] h3').text()).toBe('Afternoon')
          expect($('[data-test="eveningEvents"] h3').text()).toBe('Evening')
          expect($('[data-test="timetableLink"] a').text()).toBe('View my timetable')
          expect($('[data-test="timetableLink"] a').attr('href')).toBe('/timetable')
        })
    })
  })
})
