import type { Express, NextFunction, Request, Response } from 'express'
import request from 'supertest'

import { createMockPrisonerContactRegistryService } from '../../services/testutils/mocks'
import { prisonerContact } from '../../utils/mocks/visitors'
import { appWithAllRoutes } from '../testutils/appSetup'

jest.mock('../../constants/featureFlags', () => ({
  ALLOW_ALL_PRISONS: 'ALL',
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

const prisonerContactRegistryService = createMockPrisonerContactRegistryService()

const mockServices = {
  prisonerContactRegistryService,
}

describe('GET /visits', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    app = appWithAllRoutes({
      services: { prisonerContactRegistryService },
    })
  })

  it('should render the /visits view', async () => {
    mockServices.prisonerContactRegistryService.getSocialVisitors.mockResolvedValue([prisonerContact])

    const res = await request(app).get('/visits')

    expect(res.status).toBe(200)
    expect(mockServices.prisonerContactRegistryService.getSocialVisitors).toHaveBeenCalledWith('sub')
  })
})
