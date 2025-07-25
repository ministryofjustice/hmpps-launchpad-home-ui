import type { Express, NextFunction, Request, Response } from 'express'
import request from 'supertest'

import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { createMockAdjucationsService } from '../../services/testutils/mocks'
import { formattedAdjudication, reportedAdjudication } from '../../utils/mocks/adjudications'
import { appWithAllRoutes } from '../testutils/appSetup'
import { user } from '../../utils/mocks/user'
import { AUDIT_ACTIONS, AUDIT_PAGE_NAMES } from '../../constants/audit'

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

const auditServiceSpy = jest.spyOn(auditService, 'sendAuditMessage')

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
        action: AUDIT_ACTIONS.VIEW_PAGE,
        details: expect.stringContaining(AUDIT_PAGE_NAMES.ADJUDICATIONS),
      }),
    )
  })

  it('should render the /adjudications/:chargeNumber view', async () => {
    mockServices.adjudicationsService.getReportedAdjudication.mockResolvedValue({ reportedAdjudication })

    const res = await request(app).get('/adjudications/12345')

    expect(res.status).toBe(200)
    expect(mockServices.adjudicationsService.getReportedAdjudication).toHaveBeenCalledWith('12345', 'CKI', 'G1234UE')
  })

  it('should audit the /adjudications/:chargeNumber view', async () => {
    mockServices.adjudicationsService.getReportedAdjudication.mockResolvedValue({ reportedAdjudication })

    await request(app).get('/adjudications/12345')

    expect(auditServiceSpy).toHaveBeenCalledTimes(1)
    expect(auditServiceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        action: AUDIT_ACTIONS.VIEW_PAGE,
        details: expect.stringContaining(AUDIT_PAGE_NAMES.CHARGE),
      }),
    )
  })

  it('/adjudications/:chargeNumber view should redirect for user prisoner number not matching the fetched adjudication', async () => {
    user.idToken.sub = 'incorrectId'
    app = appWithAllRoutes({
      services: { adjudicationsService },
      userSupplier: () => user,
    })
    mockServices.adjudicationsService.getReportedAdjudication.mockResolvedValue({ reportedAdjudication })

    const res = await request(app).get('/adjudications/12345')

    expect(res.status).toBe(302) // redirect status code
    expect(mockServices.adjudicationsService.getReportedAdjudication).toHaveBeenCalledWith(
      '12345',
      'CKI',
      'incorrectId',
    )
  })
})
