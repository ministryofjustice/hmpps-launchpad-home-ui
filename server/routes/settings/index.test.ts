import type { Express, NextFunction, Request, Response } from 'express'
import request from 'supertest'

import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { createMockLaunchpadAuthService } from '../../services/testutils/mocks'
import { client } from '../../utils/mocks/client'
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

const launchpadAuthService = createMockLaunchpadAuthService()

const mockServices = {
  launchpadAuthService,
}

describe('GET /settings', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    auditServiceSpy.mockResolvedValue()
    app = appWithAllRoutes({
      services: { launchpadAuthService },
    })
  })

  it('should render the /settings view with approved clients', async () => {
    mockServices.launchpadAuthService.getApprovedClients.mockResolvedValue({
      page: 1,
      exhausted: true,
      totalElements: 1,
      content: [client],
    })

    const res = await request(app).get('/settings')

    expect(res.status).toBe(200)
    expect(mockServices.launchpadAuthService.getApprovedClients).toHaveBeenCalledWith('sub', '67890', 'ACCESS_TOKEN')
  })

  it('should audit the /settings view', async () => {
    mockServices.launchpadAuthService.getApprovedClients.mockResolvedValue({
      page: 1,
      exhausted: true,
      totalElements: 1,
      content: [client],
    })

    await request(app).get('/settings')

    expect(auditServiceSpy).toHaveBeenCalledTimes(1)
    expect(auditServiceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        action: AUDIT_ACTIONS.VIEW_PAGE,
        details: expect.stringContaining(AUDIT_PAGE_NAMES.SETTINGS),
      }),
    )
  })
})
