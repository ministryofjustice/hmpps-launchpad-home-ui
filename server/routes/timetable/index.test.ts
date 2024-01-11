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
    // return request(app)
    //   .get('/timetable')
    //   .expect('Content-Type', /html/)
    //   .expect(res => {
    //     const $ = cheerio.load(res.text)
    //     // console.log(res.text)
    //     // expect($('[data-test="main-content"]:nth-child(1)').text()).toBe('Timetable')
    //   })
  })
})

/*
  it('should render the expected section title', () => {
    return request(app)
      .get('/timetable')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = cheerio.load(res.text)

        expect($('[data-test="tiles-panel"] .link-tile:nth-child(1) h3').text()).toBe('Self-service')
        expect($('[data-test="tiles-panel"] .link-tile:nth-child(1) a').attr('href')).toBe(SELF_SERVICE_URL)
        expect($('[data-test="tiles-panel"] .link-tile:nth-child(1) p').text()).toBe('Access to kiosk apps')


      })
  })

  it('should render the homepage link tiles', () => {
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

        expect($('[data-test="tiles-panel"] .link-tile:nth-child(4) h3').text()).toBe('Inside Time')
        expect($('[data-test="tiles-panel"] .link-tile:nth-child(4) a').attr('href')).toBe(INSIDE_TIME_URL)
        expect($('[data-test="tiles-panel"] .link-tile:nth-child(4) p').text()).toBe(
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

  it('should render a profile link tile', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = cheerio.load(res.text)
        expect($('#internal-link-tile-profile a').attr('href')).toBe(`${CONTENT_HUB_URL}/profile`)
        expect($('#internal-link-tile-profile a h2').text()).toBe('Profile')
        expect($('#internal-link-tile-profile a p').text()).toBe(
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
*/
