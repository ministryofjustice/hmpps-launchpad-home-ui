import type { Express, NextFunction, Request, Response } from 'express'
import request from 'supertest'

import { createMockLaunchpadAuthService } from '../../services/testutils/mocks'
import { client } from '../../utils/mocks/client'
import { appWithAllRoutes } from '../testutils/appSetup'
import { AUDIT_EVENTS, auditService } from '../../services/audit/auditService'
import objectContaining = jasmine.objectContaining

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
const auditServiceSpy = jest.spyOn(auditService, 'audit')

const launchpadAuthService = createMockLaunchpadAuthService()

describe('GET /remove-access', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    auditServiceSpy.mockResolvedValue()
    app = appWithAllRoutes({
      services: { launchpadAuthService },
    })
  })

  it('should render the remove-access view with valid client ID', async () => {
    launchpadAuthService.getApprovedClients.mockResolvedValue({
      page: 1,
      exhausted: true,
      totalElements: 1,
      content: [client],
    })

    const res = await request(app).get('/remove-access').query({
      clientId: client.id,
      clientLogoUri: client.logoUri,
      client: client.name,
    })

    expect(res.status).toBe(200)
    expect(res.text).toContain(client.name)
    expect(launchpadAuthService.getApprovedClients).toHaveBeenCalledWith('sub', '67890', 'ACCESS_TOKEN')
  })

  it('should audit the page view', async () => {
    launchpadAuthService.getApprovedClients.mockResolvedValue({
      page: 1,
      exhausted: true,
      totalElements: 1,
      content: [client],
    })

    await request(app).get('/remove-access').query({
      clientId: client.id,
      clientLogoUri: client.logoUri,
      client: client.name,
    })

    expect(auditServiceSpy).toHaveBeenCalledTimes(1)
    expect(auditServiceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        what: AUDIT_EVENTS.VIEW_REMOVE_APP_ACCESS,
        details: {
          clientId: client.id,
          client: client.name,
        },
      }),
    )
  })

  it('should redirect to /settings with error when invalid client ID is provided', async () => {
    launchpadAuthService.getApprovedClients.mockResolvedValue({
      page: 1,
      exhausted: true,
      totalElements: 1,
      content: [],
    })

    const res = await request(app).get('/remove-access').query({
      clientId: 'invalid-client-id',
      clientLogoUri: client.logoUri,
      client: client.name,
    })

    expect(res.status).toBe(302)
    expect(res.header.location).toBe('/settings')
    expect(launchpadAuthService.getApprovedClients).toHaveBeenCalledWith('sub', '67890', 'ACCESS_TOKEN')
    expect(res.text).toContain('Found. Redirecting to /settings')
  })
})

describe('POST /remove-access', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    app = appWithAllRoutes({
      services: { launchpadAuthService },
      disableCsrf: true,
    })
  })

  it('should remove client access and redirect to /settings with success', async () => {
    launchpadAuthService.getApprovedClients.mockResolvedValue({
      page: 1,
      exhausted: true,
      totalElements: 1,
      content: [client],
    })

    const res = await request(app).post('/remove-access').send({
      userId: 'sub',
      clientId: client.id,
      client: client.name,
      action: 'remove',
    })

    expect(res.status).toBe(302)
    expect(res.header.location).toBe(`/settings?success=true&client=${encodeURIComponent(client.name)}`)
    expect(launchpadAuthService.getApprovedClients).toHaveBeenCalledWith('sub', '67890', 'ACCESS_TOKEN')
    expect(launchpadAuthService.removeClientAccess).toHaveBeenCalledWith(client.id, 'sub', '67890', 'ACCESS_TOKEN')
  })

  it('should redirect to /settings with error if client removal fails', async () => {
    launchpadAuthService.getApprovedClients.mockResolvedValue({
      page: 1,
      exhausted: true,
      totalElements: 1,
      content: [client],
    })

    launchpadAuthService.removeClientAccess.mockRejectedValue(new Error('Removal failed'))

    const res = await request(app).post('/remove-access').send({
      userId: 'sub',
      clientId: client.id,
      client: client.name,
      action: 'remove',
    })

    expect(res.status).toBe(302)
    expect(res.header.location).toBe('/settings?success=false')
    expect(launchpadAuthService.getApprovedClients).toHaveBeenCalledWith('sub', '67890', 'ACCESS_TOKEN')
    expect(launchpadAuthService.removeClientAccess).toHaveBeenCalledWith(client.id, 'sub', '67890', 'ACCESS_TOKEN')
  })

  it('should redirect to /settings with error when invalid client ID is provided', async () => {
    launchpadAuthService.getApprovedClients.mockResolvedValue({
      page: 1,
      exhausted: true,
      totalElements: 1,
      content: [],
    })

    const res = await request(app).post('/remove-access').send({
      userId: 'sub',
      clientId: 'invalid-client-id',
      client: client.name,
      action: 'remove',
    })

    expect(res.status).toBe(302)
    expect(res.header.location).toBe('/settings')
    expect(launchpadAuthService.getApprovedClients).toHaveBeenCalledWith('sub', '67890', 'ACCESS_TOKEN')
    expect(launchpadAuthService.removeClientAccess).not.toHaveBeenCalled()
  })

  it('should audit a client deletion', async () => {
    launchpadAuthService.getApprovedClients.mockResolvedValue({
      page: 1,
      exhausted: true,
      totalElements: 1,
      content: [client],
    })

    await request(app).post('/remove-access').send({
      userId: 'sub',
      clientId: client.id,
      client: client.name,
      action: 'remove',
    })

    expect(auditServiceSpy).toHaveBeenCalledTimes(1)
    expect(auditServiceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        what: AUDIT_EVENTS.DELETE_APP_ACCESS,
        details: {
          clientId: client.id,
          client: client.name,
        },
      }),
    )
  })

  it('should not audit a cancellation', async () => {
    launchpadAuthService.getApprovedClients.mockResolvedValue({
      page: 1,
      exhausted: true,
      totalElements: 1,
      content: [client],
    })

    await request(app).post('/remove-access').send({
      userId: 'sub',
      clientId: client.id,
      client: client.name,
      action: 'cancel',
    })

    expect(auditServiceSpy).toHaveBeenCalledTimes(0)
  })
})
