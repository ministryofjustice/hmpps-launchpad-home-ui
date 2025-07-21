import type { Express } from 'express'
import request from 'supertest'

import { auditService } from '@ministryofjustice/hmpps-audit-client'
import * as utils from '../../utils/utils'
import { appWithAllRoutes } from '../testutils/appSetup'
import { AUDIT_ACTIONS, AUDIT_PAGE_NAMES } from '../../constants/audit'
import { Establishment } from '../../@types/launchpad'

let app: Express
const auditServiceSpy = jest.spyOn(auditService, 'sendAuditMessage')
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
    ['/self-service', establishment.selfServiceURL],
    ['/content-hub', establishment.prisonerContentHubURL],
    ['/prison-radio', `${establishment.prisonerContentHubURL}/tags/785`],
    ['/inside-time', 'https://insidetimeprison.org/'],
  ])('%s', (url: string, redirectUrl: string) => {
    it(`should redirect the user`, async () => {
      const res = await request(app).get(`/external/${url}`)

      expect(res.redirect).toBe(true)
      expect(res.headers.location).toEqual(redirectUrl)
    })

    it(`should audit the user`, async () => {
      await request(app).get(`/external/${url}`)

      expect(auditServiceSpy).toHaveBeenCalledTimes(1)
      expect(auditServiceSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          action: AUDIT_ACTIONS.VIEW_PAGE,
          details: expect.stringContaining(AUDIT_PAGE_NAMES.EXTERNAL),
        }),
      )
    })
  })

  describe('any other url', () => {
    it('should return a 404', async () => {
      const res = await request(app).get('/external/test')

      expect(res.status).toBe(404)
    })
  })
})
