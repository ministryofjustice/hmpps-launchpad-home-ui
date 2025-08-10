import type { Express, NextFunction, Request, Response } from 'express'
import request from 'supertest'

import { AUDIT_EVENTS, auditService } from '../../services/audit/auditService'
import { createMockAdjucationsService } from '../../services/testutils/mocks'
import { formattedAdjudication, reportedAdjudication } from '../../utils/mocks/adjudications'
import { appWithAllRoutes } from '../testutils/appSetup'
import { user } from '../../utils/mocks/user'

jest.mock('i18next', () => ({
  t: jest.fn().mockImplementation((key: string) => key),
  language: 'en',
}))

jest.mock('../../constants/featureFlags', () => ({
  Features: {
    Adjudications: 'adjudications',
    Settings: 'settings',
    Transactions: 'transactions',
    Visits: 'visits',
  },
  featureFlags: {
    adjudications: {
      enabled: true,
      allowedPrisons: ['MDI'],
    },
  },
}))

jest.mock('../../middleware/featureFlag/featureFlag', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      return (_req: Request, _res: Response, next: NextFunction): void => {
        next()
      }
    }),
  }
})

jest.mock('../../utils/adjudications/formatAdjudication', () => ({
  formatAdjudication: jest.fn().mockResolvedValue(formattedAdjudication),
}))

let app: Express

const auditServiceSpy = jest.spyOn(auditService, 'audit')

const adjudicationsService = createMockAdjucationsService()

const mockServices = {
  adjudicationsService,
}

describe('GET /adjudications', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    auditServiceSpy.mockResolvedValue()
    app = appWithAllRoutes({
      services: { adjudicationsService },
      userSupplier: () => user,
    })
  })

  it('should render the /adjudications view', async () => {
    mockServices.adjudicationsService.getReportedAdjudicationsFor.mockResolvedValue({
      content: [reportedAdjudication],
    })

    const res = await request(app).get('/adjudications')

    expect(res.status).toBe(200)
    expect(mockServices.adjudicationsService.getReportedAdjudicationsFor).toHaveBeenCalledWith(
      '12345',
      'CKI',
      'en',
      'G1234UE',
    )
  })

  it('should audit the /adjudications view', async () => {
    mockServices.adjudicationsService.getReportedAdjudicationsFor.mockResolvedValue({
      content: [reportedAdjudication],
    })

    await request(app).get('/adjudications')

    expect(auditServiceSpy).toHaveBeenCalledTimes(1)
    expect(auditServiceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        what: AUDIT_EVENTS.VIEW_ADJUDICATIONS,
        details: {},
      }),
    )
  })

  it('should audit the /adjudications pagination', async () => {
    mockServices.adjudicationsService.getReportedAdjudicationsFor.mockResolvedValue({
      content: [reportedAdjudication],
    })

    await request(app).get('/adjudications?page=2')

    expect(auditServiceSpy).toHaveBeenCalledTimes(1)
    expect(auditServiceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        what: AUDIT_EVENTS.VIEW_ADJUDICATIONS,
        details: { page: '2' },
      }),
    )
  })

  describe('the /adjudications/:chargeNumber route', () => {
    it('should render the view', async () => {
      mockServices.adjudicationsService.getReportedAdjudication.mockResolvedValue({ reportedAdjudication })

      const res = await request(app).get('/adjudications/12345')

      expect(res.status).toBe(200)
      expect(mockServices.adjudicationsService.getReportedAdjudication).toHaveBeenCalledWith('12345', 'CKI', 'G1234UE')
    })

    it('should audit successful requests', async () => {
      mockServices.adjudicationsService.getReportedAdjudication.mockResolvedValue({ reportedAdjudication })

      await request(app).get('/adjudications/12345')

      expect(auditServiceSpy).toHaveBeenCalledTimes(1)
      expect(auditServiceSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          what: AUDIT_EVENTS.VIEW_CHARGE,
          details: {
            chargeNumber: '12345',
          },
        }),
      )
    })

    it('should redirect to /adjudications if the charge does not exist', async () => {
      mockServices.adjudicationsService.getReportedAdjudication.mockResolvedValue({ reportedAdjudication: null })

      const res = await request(app).get('/adjudications/12345')

      expect(res.status).toBe(302)
      expect(res.headers.location).toBe('/adjudications')

      expect(auditServiceSpy).not.toHaveBeenCalled()
    })

    it('should redirect to /adjudications if the charge does not belong to the user', async () => {
      user.idToken.sub = 'incorrectId'
      app = appWithAllRoutes({
        services: { adjudicationsService },
        userSupplier: () => user,
      })
      mockServices.adjudicationsService.getReportedAdjudication.mockResolvedValue({ reportedAdjudication })

      const res = await request(app).get('/adjudications/12345')

      expect(res.status).toBe(302)
      expect(res.headers.location).toBe('/adjudications')

      expect(auditServiceSpy).not.toHaveBeenCalled()
    })

    it('should redirect to /adjudications if the url contains any invalid characters', async () => {
      mockServices.adjudicationsService.getReportedAdjudication.mockResolvedValue({ reportedAdjudication })

      const res = await request(app).get('/adjudications/123@45')

      expect(res.status).toBe(302)
      expect(res.headers.location).toBe('/adjudications')

      expect(mockServices.adjudicationsService.getReportedAdjudicationsFor).not.toHaveBeenCalled()
      expect(auditServiceSpy).not.toHaveBeenCalled()
    })
  })
})
