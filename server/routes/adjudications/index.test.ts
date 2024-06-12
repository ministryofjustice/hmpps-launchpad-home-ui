import type { Express, NextFunction, Request, Response } from 'express'
import request from 'supertest'

import { createMockPrisonerProfileService } from '../../services/testutils/mocks'
import { reportedAdjudication } from '../../utils/mocks/adjudications'
import { appWithAllRoutes } from '../testutils/appSetup'

jest.mock('../../constants/featureFlags', () => ({
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

let app: Express

const prisonerProfileService = createMockPrisonerProfileService()

const mockServices = {
  prisonerProfileService,
}

describe('GET /adjudications', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    app = appWithAllRoutes({
      services: { prisonerProfileService },
    })
  })

  it('should render the /adjudications view', async () => {
    mockServices.prisonerProfileService.getReportedAdjudicationsFor.mockResolvedValue({
      content: [reportedAdjudication],
    })

    const res = await request(app).get('/adjudications')

    expect(res.status).toBe(200)
    expect(mockServices.prisonerProfileService.getReportedAdjudicationsFor).toHaveBeenCalledWith('12345', '12345')
  })

  it('should render the /adjudications/:chargeNumber view', async () => {
    mockServices.prisonerProfileService.getReportedAdjudication.mockResolvedValue({ reportedAdjudication })

    const res = await request(app).get('/adjudications/12345')

    expect(res.status).toBe(200)
    expect(mockServices.prisonerProfileService.getReportedAdjudication).toHaveBeenCalledWith('12345', '12345')
  })
})
