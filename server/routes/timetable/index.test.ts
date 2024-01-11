import type { Express } from 'express'
import request from 'supertest'
import * as cheerio from 'cheerio'
import { appWithAllRoutes } from '../testutils/appSetup'
import { createMockPrisonerProfileService } from '../../services/testutils/mocks'
import { TimetableEvents } from '../../@types/launchpad'

let app: Express

const prisonerProfileService = createMockPrisonerProfileService()

beforeEach(() => {
  app = appWithAllRoutes({
    services: { prisonerProfileService },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /timetable', () => {
  let eventsData: TimetableEvents

  beforeEach(() => {
    eventsData = {
      '2024-01-11': {
        morning: {
          finished: false,
          events: [
            {
              description: 'AM 1 HIGHER FUNC. SKILLS',
              startTime: '8.50am',
              endTime: '10.20am',
              location: 'Level2 class6',
              timeString: '8.50am to 10.20am',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
            {
              description: 'AM 2 HIGHER FUNC. SKILLS',
              startTime: '10.20am',
              endTime: '11.50am',
              location: 'Level2 class6',
              timeString: '10.20am to 11.50am',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
          ],
        },
        afternoon: {
          finished: false,
          events: [
            {
              description: 'PM 3 HIGHER FUNC. SKILLS',
              startTime: '1.40pm',
              endTime: '3.10pm',
              location: 'Level2 class6',
              timeString: '1.40pm to 3.10pm',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
            {
              description: 'PM 4 HIGHER FUNC. SKILLS',
              startTime: '3.10pm',
              endTime: '4.40pm',
              location: 'Level2 class6',
              timeString: '3.10pm to 4.40pm',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
          ],
        },
        evening: {
          finished: false,
          events: [
            {
              description: 'ED CLEANING ORD.',
              startTime: '6.00pm',
              endTime: '7.00pm',
              location: 'Wing cleaner',
              timeString: '6.00pm to 7.00pm',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
          ],
        },
        title: 'Today',
      },
      '2024-01-12': {
        morning: {
          finished: false,
          events: [
            {
              description: 'AM 1 GYM',
              startTime: '8.50am',
              endTime: '10.20am',
              location: 'Gym domestics',
              timeString: '8.50am to 10.20am',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
            {
              description: 'AM 2 GYM',
              startTime: '10.20am',
              endTime: '11.50am',
              location: 'Gym domestics',
              timeString: '10.20am to 11.50am',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
          ],
        },
        afternoon: {
          finished: false,
          events: [
            {
              description: 'PM 3 HIGHER FUNC. SKILLS',
              startTime: '1.40pm',
              endTime: '3.10pm',
              location: 'Level2 class6',
              timeString: '1.40pm to 3.10pm',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
            {
              description: 'PM 4 HIGHER FUNC. SKILLS',
              startTime: '3.10pm',
              endTime: '4.40pm',
              location: 'Level2 class6',
              timeString: '3.10pm to 4.40pm',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
          ],
        },
        evening: {
          finished: false,
          events: [
            {
              description: 'ED CLEANING ORD.',
              startTime: '6.00pm',
              endTime: '7.00pm',
              location: 'Wing cleaner',
              timeString: '6.00pm to 7.00pm',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
          ],
        },
        title: 'Tomorrow',
      },
      '2024-01-13': {
        morning: {
          finished: false,
          events: [],
        },
        afternoon: {
          finished: false,
          events: [],
        },
        evening: {
          finished: false,
          events: [],
        },
        title: 'Saturday 13 January',
      },
      '2024-01-14': {
        morning: {
          finished: false,
          events: [],
        },
        afternoon: {
          finished: false,
          events: [],
        },
        evening: {
          finished: false,
          events: [],
        },
        title: 'Sunday 14 January',
      },
      '2024-01-15': {
        morning: {
          finished: false,
          events: [
            {
              description: 'AM 1 HIGHER FUNC. SKILLS',
              startTime: '8.50am',
              endTime: '10.20am',
              location: 'Level2 class6',
              timeString: '8.50am to 10.20am',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
            {
              description: 'AM 2 HIGHER FUNC. SKILLS',
              startTime: '10.20am',
              endTime: '11.50am',
              location: 'Level2 class6',
              timeString: '10.20am to 11.50am',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
          ],
        },
        afternoon: {
          finished: false,
          events: [
            {
              description: 'PM 3 HIGHER FUNC. SKILLS',
              startTime: '1.40pm',
              endTime: '3.10pm',
              location: 'Level2 class6',
              timeString: '1.40pm to 3.10pm',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
            {
              description: 'PM 4 HIGHER FUNC. SKILLS',
              startTime: '3.10pm',
              endTime: '4.40pm',
              location: 'Level2 class6',
              timeString: '3.10pm to 4.40pm',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
          ],
        },
        evening: {
          finished: false,
          events: [
            {
              description: 'ED CLEANING ORD.',
              startTime: '6.00pm',
              endTime: '7.00pm',
              location: 'Wing cleaner',
              timeString: '6.00pm to 7.00pm',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
          ],
        },
        title: 'Monday 15 January',
      },
      '2024-01-16': {
        morning: {
          finished: false,
          events: [
            {
              description: 'AM 1 HIGHER FUNC. SKILLS',
              startTime: '8.50am',
              endTime: '10.20am',
              location: 'Level2 class6',
              timeString: '8.50am to 10.20am',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
            {
              description: 'AM 2 HIGHER FUNC. SKILLS',
              startTime: '10.20am',
              endTime: '11.50am',
              location: 'Level2 class6',
              timeString: '10.20am to 11.50am',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
          ],
        },
        afternoon: {
          finished: false,
          events: [
            {
              description: 'PM 3 HIGHER FUNC. SKILLS',
              startTime: '1.40pm',
              endTime: '3.10pm',
              location: 'Level2 class6',
              timeString: '1.40pm to 3.10pm',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
            {
              description: 'PM 4 HIGHER FUNC. SKILLS',
              startTime: '3.10pm',
              endTime: '4.40pm',
              location: 'Level2 class6',
              timeString: '3.10pm to 4.40pm',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
          ],
        },
        evening: {
          finished: false,
          events: [
            {
              description: 'ED CLEANING ORD.',
              startTime: '6.00pm',
              endTime: '7.00pm',
              location: 'Wing cleaner',
              timeString: '6.00pm to 7.00pm',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
          ],
        },
        title: 'Tuesday 16 January',
      },
      '2024-01-17': {
        morning: {
          finished: false,
          events: [
            {
              description: 'AM 1 HIGHER FUNC. SKILLS',
              startTime: '8.50am',
              endTime: '10.20am',
              location: 'Level2 class6',
              timeString: '8.50am to 10.20am',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
            {
              description: 'AM 2 HIGHER FUNC. SKILLS',
              startTime: '10.20am',
              endTime: '11.50am',
              location: 'Level2 class6',
              timeString: '10.20am to 11.50am',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
          ],
        },
        afternoon: {
          finished: false,
          events: [
            {
              description: 'PM 3 HIGHER FUNC. SKILLS',
              startTime: '1.40pm',
              endTime: '3.10pm',
              location: 'Level2 class6',
              timeString: '1.40pm to 3.10pm',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
            {
              description: 'PM 4 HIGHER FUNC. SKILLS',
              startTime: '3.10pm',
              endTime: '4.40pm',
              location: 'Level2 class6',
              timeString: '3.10pm to 4.40pm',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
          ],
        },
        evening: {
          finished: false,
          events: [
            {
              description: 'ED CLEANING ORD.',
              startTime: '6.00pm',
              endTime: '7.00pm',
              location: 'Wing cleaner',
              timeString: '6.00pm to 7.00pm',
              eventType: 'PRISON_ACT',
              finished: false,
              status: 'SCH',
              paid: false,
            },
          ],
        },
        title: 'Wednesday 17 January',
      },
    }

    prisonerProfileService.getEventsFor.mockResolvedValue(eventsData)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the expected section title', () => {
    return request(app)
      .get('/timetable')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = cheerio.load(res.text)
        expect($('[data-test="main-content"] h1').text()).toBe('Timetable')
      })
  })
})