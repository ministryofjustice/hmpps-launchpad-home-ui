import { auditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'
import express, { Express } from 'express'
import { user } from '../utils/mocks/user'
import { AUDIT_ACTIONS } from '../constants/audit'
import auditPageViewMiddleware from './auditPageViewMiddleware'

const serviceName = 'hmpps-launchpad-home-ui'
const auditServiceSpy = jest.spyOn(auditService, 'sendAuditMessage')

const app: Express = express()
app.use((req, res, next) => {
  req.user = user
  res.locals = {}
  res.locals.user = { ...req.user }
  next()
})
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

beforeEach(() => {
  jest.clearAllMocks()

  auditServiceSpy.mockResolvedValue()
})

describe('audit page view middleware', () => {
  describe('get routes', () => {
    it('should audit a basic get request', async () => {
      const pageName = 'basicGet'
      const baseUrl = '/basicGet'
      app.get(baseUrl, auditPageViewMiddleware(pageName), async (_, res) => {
        res.send('')
      })

      await request(app).get(baseUrl)

      expect(auditServiceSpy).toHaveBeenCalledTimes(1)

      const audited = auditServiceSpy.mock.lastCall[0]
      expect(audited).toEqual(
        expect.objectContaining({
          who: user.idToken.sub,
          action: AUDIT_ACTIONS.VIEW_PAGE,
          service: serviceName,
        }),
      )
      expect(JSON.parse(audited.details)).toEqual(
        expect.objectContaining({
          page: pageName,
          method: 'GET',
          pageUrl: baseUrl,
          params: {},
          query: {},
          body: {},
          agencyId: user.idToken.establishment.agency_id,
          bookingId: user.idToken.booking.id,
        }),
      )
    })

    it('should audit a get request with a query string', async () => {
      const pageName = 'getWithQuery'
      const baseUrl = '/getWithQuery'
      app.get(baseUrl, auditPageViewMiddleware(pageName), async (_, res) => {
        res.send('')
      })

      await request(app).get(`${baseUrl}?test=1&value=test`)

      expect(auditServiceSpy).toHaveBeenCalledTimes(1)

      const audited = auditServiceSpy.mock.lastCall[0]
      expect(audited).toEqual(
        expect.objectContaining({
          who: user.idToken.sub,
          action: AUDIT_ACTIONS.VIEW_PAGE,
          service: serviceName,
        }),
      )
      expect(JSON.parse(audited.details)).toEqual(
        expect.objectContaining({
          page: pageName,
          method: 'GET',
          pageUrl: `${baseUrl}?test=1&value=test`,
          params: {},
          query: {
            test: '1',
            value: 'test',
          },
          body: {},
          agencyId: user.idToken.establishment.agency_id,
          bookingId: user.idToken.booking.id,
        }),
      )
    })

    it('should audit a get request with a query string and route params', async () => {
      const pageName = 'getWithRouteParam'
      const baseUrl = '/getWithRouteParam/123/1'
      app.get('/getWithRouteParam/:id/:page', auditPageViewMiddleware(pageName), async (_, res) => {
        res.send('')
      })

      await request(app).get(`${baseUrl}?test=1&value=test`)

      expect(auditServiceSpy).toHaveBeenCalledTimes(1)

      const audited = auditServiceSpy.mock.lastCall[0]
      expect(audited).toEqual(
        expect.objectContaining({
          who: user.idToken.sub,
          action: AUDIT_ACTIONS.VIEW_PAGE,
          service: serviceName,
        }),
      )
      expect(JSON.parse(audited.details)).toEqual(
        expect.objectContaining({
          page: pageName,
          method: 'GET',
          pageUrl: `${baseUrl}?test=1&value=test`,
          params: {
            id: '123',
            page: '1',
          },
          query: {
            test: '1',
            value: 'test',
          },
          body: {},
          agencyId: user.idToken.establishment.agency_id,
          bookingId: user.idToken.booking.id,
        }),
      )
    })
  })

  describe('post routes', () => {
    const requestBody = { param1: 'param1', param2: [1, 2, 3, 4] }

    it('should audit a basic post request', async () => {
      const pageName = 'basicPost'
      const baseUrl = '/basicPost'
      app.post(baseUrl, auditPageViewMiddleware(pageName), async (_, res) => {
        res.send('')
      })

      await request(app).post(baseUrl).send(requestBody)

      expect(auditServiceSpy).toHaveBeenCalledTimes(1)

      const audited = auditServiceSpy.mock.lastCall[0]
      expect(audited).toEqual(
        expect.objectContaining({
          who: user.idToken.sub,
          action: AUDIT_ACTIONS.VIEW_PAGE,
          service: serviceName,
        }),
      )
      expect(JSON.parse(audited.details)).toEqual(
        expect.objectContaining({
          page: pageName,
          method: 'POST',
          pageUrl: baseUrl,
          params: {},
          query: {},
          body: requestBody,
          agencyId: user.idToken.establishment.agency_id,
          bookingId: user.idToken.booking.id,
        }),
      )
    })

    it('should audit a post request with a query string', async () => {
      const pageName = 'postWithQuery'
      const baseUrl = '/postWithQuery'
      app.post(baseUrl, auditPageViewMiddleware(pageName), async (_, res) => {
        res.send('')
      })

      await request(app).post(`${baseUrl}?test=1&value=test`).send(requestBody)

      expect(auditServiceSpy).toHaveBeenCalledTimes(1)

      const audited = auditServiceSpy.mock.lastCall[0]
      expect(audited).toEqual(
        expect.objectContaining({
          who: user.idToken.sub,
          action: AUDIT_ACTIONS.VIEW_PAGE,
          service: serviceName,
        }),
      )
      expect(JSON.parse(audited.details)).toEqual(
        expect.objectContaining({
          page: pageName,
          method: 'POST',
          pageUrl: `${baseUrl}?test=1&value=test`,
          params: {},
          query: {
            test: '1',
            value: 'test',
          },
          body: requestBody,
          agencyId: user.idToken.establishment.agency_id,
          bookingId: user.idToken.booking.id,
        }),
      )
    })

    it('should audit a post request with a query string and route params', async () => {
      const pageName = 'postWithRouteParams'
      const baseUrl = '/postWithRouteParams/123/1'
      app.post('/postWithRouteParams/:id/:page', auditPageViewMiddleware(pageName), async (_, res) => {
        res.send('')
      })

      await request(app).post(`${baseUrl}?test=1&value=test`).send(requestBody)

      expect(auditServiceSpy).toHaveBeenCalledTimes(1)

      const audited = auditServiceSpy.mock.lastCall[0]
      expect(audited).toEqual(
        expect.objectContaining({
          who: user.idToken.sub,
          action: AUDIT_ACTIONS.VIEW_PAGE,
          service: serviceName,
        }),
      )
      expect(JSON.parse(audited.details)).toEqual(
        expect.objectContaining({
          page: pageName,
          method: 'POST',
          pageUrl: `${baseUrl}?test=1&value=test`,
          params: {
            id: '123',
            page: '1',
          },
          query: {
            test: '1',
            value: 'test',
          },
          body: requestBody,
          agencyId: user.idToken.establishment.agency_id,
          bookingId: user.idToken.booking.id,
        }),
      )
    })
  })
})
