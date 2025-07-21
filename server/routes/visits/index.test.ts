import type { Express, NextFunction, Request, Response } from 'express'
import request from 'supertest'

import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { createMockPrisonerContactRegistryService } from '../../services/testutils/mocks'
import { prisonerContact } from '../../utils/mocks/visitors'
import { appWithAllRoutes } from '../testutils/appSetup'
import { AUDIT_ACTIONS, AUDIT_PAGE_NAMES } from '../../constants/audit'

jest.mock('../../constants/featureFlags', () => ({
  ALLOW_ALL_PRISONS: 'ALL',
  Features: {
    Adjudications: 'adjudications',
    Settings: 'settings',
    Transactions: 'transactions',
    Visits: 'visits',
  },
  featureFlags: {
    visits: {
      enabled: true,
      allowedPrisons: 'ALL',
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

let app: Express
const auditServiceSpy = jest.spyOn(auditService, 'sendAuditMessage')

const prisonerContactRegistryService = createMockPrisonerContactRegistryService()

const mockServices = {
  prisonerContactRegistryService,
}

describe('GET /visits', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    auditServiceSpy.mockResolvedValue()
    app = appWithAllRoutes({
      services: { prisonerContactRegistryService },
    })
  })

  it('should render the /visits view', async () => {
    mockServices.prisonerContactRegistryService.getSocialVisitors.mockResolvedValue([prisonerContact])

    const res = await request(app).get('/visits')

    expect(res.status).toBe(200)
    expect(mockServices.prisonerContactRegistryService.getSocialVisitors).toHaveBeenCalledWith('sub', '67890')
  })

  it('should audit the /visits view', async () => {
    mockServices.prisonerContactRegistryService.getSocialVisitors.mockResolvedValue([prisonerContact])

    await request(app).get('/visits')

    expect(auditServiceSpy).toHaveBeenCalledTimes(1)
    expect(auditServiceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        action: AUDIT_ACTIONS.VIEW_PAGE,
        details: expect.stringContaining(AUDIT_PAGE_NAMES.VISITS),
      }),
    )
  })
})
