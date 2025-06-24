import type { Express, NextFunction, Request, Response } from 'express'
import request from 'supertest'

import { createMockAdjucationsService } from '../../services/testutils/mocks'
import { formattedAdjudication, reportedAdjudication } from '../../utils/mocks/adjudications'
import { appWithAllRoutes } from '../testutils/appSetup'

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

const adjudicationsService = createMockAdjucationsService()

const mockServices = {
  adjudicationsService,
}

describe('GET /adjudications', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    app = appWithAllRoutes({
      services: { adjudicationsService },
    })
  })

  it('should render the /adjudications view', async () => {
    mockServices.adjudicationsService.getReportedAdjudicationsFor.mockResolvedValue({
      content: [reportedAdjudication],
    })

    const res = await request(app).get('/adjudications')

    expect(res.status).toBe(200)
    expect(mockServices.adjudicationsService.getReportedAdjudicationsFor).toHaveBeenCalledWith('12345', '12345', 'en')
  })

  it('should render the /adjudications/:chargeNumber view', async () => {
    mockServices.adjudicationsService.getReportedAdjudication.mockResolvedValue({ reportedAdjudication })

    const res = await request(app).get('/adjudications/12345')

    expect(res.status).toBe(200)
    expect(mockServices.adjudicationsService.getReportedAdjudication).toHaveBeenCalledWith('12345', '12345', 'sub')
  })
})
