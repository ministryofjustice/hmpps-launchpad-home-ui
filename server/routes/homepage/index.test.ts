import * as cheerio from 'cheerio'
import type { Express } from 'express'
import request from 'supertest'
import i18next from 'i18next'

import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { createMockLinksService, createMockPrisonService } from '../../services/testutils/mocks'
import { eventsSummary } from '../../utils/mocks/events'
import { links } from '../../utils/mocks/links'
import { getEstablishmentData } from '../../utils/utils'
import { appWithAllRoutes } from '../testutils/appSetup'

let app: Express
const prisonService = createMockPrisonService()
const linksService = createMockLinksService()
const auditServiceSpy = jest.spyOn(auditService, 'sendAuditMessage')

jest.mock('../../utils/utils', () => ({
  ...jest.requireActual('../../utils/utils'),
  getEstablishmentData: jest.fn(),
}))

jest.mock('i18next', () => ({
  t: (key: string) => key,
}))

beforeEach(() => {
  app = appWithAllRoutes({
    services: { prisonService, linksService },
  })

  auditServiceSpy.mockResolvedValue()
  prisonService.getPrisonerEventsSummary.mockResolvedValue(eventsSummary)
  linksService.getHomepageLinks.mockResolvedValue({ links })
})

afterEach(() => {
  jest.resetAllMocks()
})

const assertLinkTile = (
  $: cheerio.CheerioAPI,
  index: number,
  expected: { title: string; url: string; description: string },
) => {
  const tile = $(`[data-test="tiles-panel"] .link-tile:nth-child(${index})`)
  expect(tile.find('h3').text()).toBe(expected.title)
  expect(tile.find('a').attr('href')).toBe(expected.url)
  expect(tile.find('p').text()).toBe(expected.description)
}

describe('GET /', () => {
  let agencyId: string

  beforeEach(() => {
    agencyId = 'XYZ'
  })

  it('should render homepage link tiles when hidden value is false', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = cheerio.load(res.text)

        assertLinkTile($, 1, { title: 'Self-service', url: links[0].url, description: 'Access to kiosk apps' })
        assertLinkTile($, 2, {
          title: 'Content Hub',
          url: links[1].url,
          description: 'Watch, read and listen to local and national content',
        })
        assertLinkTile($, 3, {
          title: 'NPR',
          url: links[2].url,
          description: 'Listen to 24/7 music, talk, requests and playbacks',
        })

        const hiddenTile = $('[data-test="tiles-panel"] .link-tile:nth-child(4)')
        expect(hiddenTile.find('h3').text()).not.toBe('Inside Time')
        expect(hiddenTile.find('a').attr('href')).not.toBe(links[3].url)
        expect(hiddenTile.find('p').text()).not.toBe('Read the national newspaper for prisoners and detainees')
      })
  })

  it('should display a title within the homepage link tiles component if title exists', () => {
    const homepageLinks = { title: 'A Tile Panel Title', links }
    linksService.getHomepageLinks.mockResolvedValue(homepageLinks)

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = cheerio.load(res.text)
        expect($('[data-test="tiles-panel-title"]').text()).toBe('A Tile Panel Title')
      })
  })

  it('should render the homepage events summary panel', () => {
    return request(app)
      .get('/')
      .set('Accept-Language', 'en')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = cheerio.load(res.text)

        expect($('.events-summary h2').text()).toBe(i18next.t('homepage.eventsSummary.today', 'en'))

        // Check events details
        expect($('[data-test="event-detail-1"] .time').text()).toBe('8:30am to 11:45am')
        expect($('[data-test="event-detail-1"] .description').text()).toBe('Morning Exercise Gymnasium')
        expect($('[data-test="event-detail-2"] .time').text()).toBe('1:45pm to 4:45pm')
        expect($('[data-test="event-detail-2"] .description').text()).toBe('Lunch Cafeteria')
        expect($('[data-test="event-detail-3"] .time').text()).toBe('6:30pm to 7:45pm')
        expect($('[data-test="event-detail-3"] .description').text()).toBe('Educational Program Classroom A')

        expect($('.events-summary a').text()).toBe(i18next.t('homepage.eventsSummary.viewTimetable', 'en'))
        expect($('.events-summary a').attr('href')).toBe('/timetable')
      })
  })

  it('should render events summary and profile link tile if show events and profile tile flag is true', () => {
    ;(getEstablishmentData as jest.Mock).mockReturnValue({
      agencyId,
      prisonerContentHubURL: links[1].url,
      selfServiceURL: links[0].url,
    })

    return request(app)
      .get('/')
      .set('Accept-Language', 'en')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = cheerio.load(res.text)

        expect($('#events-summary-wrapper h2').text()).toBe(i18next.t('homepage.eventsSummary.today', 'en'))
        expect($('#events-summary-wrapper a').attr('href')).toBe(`/timetable`)
        expect($('#events-summary-wrapper a').text()).toBe(i18next.t('homepage.eventsSummary.viewTimetable'))
        expect($('#internal-link-tile-profile a').attr('href')).toBe(`/profile`)
        expect($('#internal-link-tile-profile a h2').text()).toBe(i18next.t('homepage.links.profile'))
        expect($('#internal-link-tile-profile a p').text()).toBe(i18next.t('homepage.links.profileDesc'))
      })
  })

  it('should hide events summary and profile link tile when hide flag is set', () => {
    ;(getEstablishmentData as jest.Mock).mockReturnValue({
      agencyId,
      prisonerContentHubURL: links[1].url,
      selfServiceURL: links[0].url,
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

        expect($('#internal-link-tile-profile a').attr('href')).not.toBe(`${links[1].url}/profile`)
        expect($('#internal-link-tile-profile a h2').text()).not.toBe('Profile')
        expect($('#internal-link-tile-profile a p').text()).not.toBe(
          'Check money, visits, IEP, adjudications and timetable',
        )
      })
  })

  it('should show inside times tile when hide flag is unset', () => {
    links[3].hidden = false
    linksService.getHomepageLinks.mockResolvedValue({ links })
    ;(getEstablishmentData as jest.Mock).mockReturnValue({
      agencyId,
      prisonerContentHubURL: links[1].url,
      selfServiceURL: links[0].url,
    })

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = cheerio.load(res.text)

        const insideTimeTile = $('[data-test="tiles-panel"] .link-tile:nth-child(4)')
        expect(insideTimeTile.find('h3').text()).toBe('Inside Time')
        expect(insideTimeTile.find('a').attr('href')).toBe(links[3].url)
        expect(insideTimeTile.find('p').text()).toBe('Read the national newspaper for prisoners and detainees')
      })
  })

  it('should hide inside times tile when hide flag is set', () => {
    links[3].hidden = true
    linksService.getHomepageLinks.mockResolvedValue({ links })
    ;(getEstablishmentData as jest.Mock).mockReturnValue({
      agencyId,
      prisonerContentHubURL: links[1].url,
      selfServiceURL: links[0].url,
    })

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = cheerio.load(res.text)

        const insideTimeTile = $('[data-test="tiles-panel"] .link-tile:nth-child(4)')
        expect(insideTimeTile.find('h3').text()).not.toBe('Inside Time')
        expect(insideTimeTile.find('a').attr('href')).not.toBe(links[3].url)
        expect(insideTimeTile.find('p').text()).not.toBe('Read the national newspaper for prisoners and detainees')
      })
  })

  it('should audit the request', () => {
    return request(app)
      .get('/')
      .set('Accept-Language', 'en')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(auditServiceSpy).toHaveBeenCalledTimes(1)
        expect(auditServiceSpy).toHaveBeenCalledWith({
          action: 'VIEW_HOMEPAGE',
          service: 'hmpps-launchpad-home-ui',
          who: 'sub',
        })
      })
  })
})
