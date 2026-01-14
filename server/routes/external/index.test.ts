import type { Express } from 'express'
import request from 'supertest'

import { AUDIT_EVENTS, auditService } from '../../services/audit/auditService'
import * as utils from '../../utils/utils'
import { appWithAllRoutes } from '../testutils/appSetup'
import { Establishment } from '../../@types/launchpad'

let app: Express
const auditServiceSpy = jest.spyOn(auditService, 'audit')
const establishmentDataSpy = jest.spyOn(utils, 'getEstablishmentData')

const establishment: Establishment = {
  agencyId: '123',
  prisonerContentHubURL: 'http://content-hub.com',
  selfServiceURL: 'http://self-service.com',
}

describe('GET /external', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    auditServiceSpy.mockResolvedValue()
    establishmentDataSpy.mockReturnValue(establishment)
    app = appWithAllRoutes({})
  })

  describe.each([
    ['self-service', establishment.selfServiceURL],
    ['content-hub', establishment.prisonerContentHubURL],
    ['prison-radio', `${establishment.prisonerContentHubURL}/tags/785`],
    ['inside-time', 'https://insidetimeprison.org/'],
    ['adjudications', `${establishment.prisonerContentHubURL}/content/4193`],
    ['incentives', `${establishment.prisonerContentHubURL}/tags/1417`],
    ['learning-and-skills', `${establishment.prisonerContentHubURL}/tags/1341`],
    ['money-and-debt', `${establishment.prisonerContentHubURL}/tags/872`],
    ['visits', `${establishment.prisonerContentHubURL}/tags/1133`],
    ['privacy-policy', `${establishment.prisonerContentHubURL}/content/4856`],
    ['transactions-help', `${establishment.prisonerContentHubURL}/content/8534`],
    ['think-through-nutrition', 'https://stg.lanah.org/'],
  ])('/external/%s', (url: string, redirectUrl: string) => {
    it(`should redirect the user`, async () => {
      const res = await request(app).get(`/external/${url}`)

      expect(res.redirect).toBe(true)
      expect(res.headers.location).toEqual(redirectUrl)
    })

    it(`should audit the user`, async () => {
      await request(app).get(`/external/${url}`)

      expect(auditServiceSpy).toHaveBeenCalledTimes(1)

      const audit = auditServiceSpy.mock.lastCall[0]
      expect(audit.what).toBe(AUDIT_EVENTS.VIEW_EXTERNAL_PAGE)
      expect(audit.details).toHaveProperty('pageUrl', `/external/${url}`)
      expect(audit.details).toHaveProperty('redirectUrl', redirectUrl)
    })
  })

  describe('any other url', () => {
    it('should return a 404', async () => {
      const res = await request(app).get('/external/test')

      expect(res.status).toBe(404)
    })
  })
})
