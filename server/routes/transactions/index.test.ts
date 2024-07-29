import type { Express, NextFunction, Request, Response } from 'express'
import request from 'supertest'

import { AgencyType } from '../../constants/agency'
import { AccountCodes } from '../../constants/transactions'

import { createMockPrisonService } from '../../services/testutils/mocks'

import { balances } from '../../utils/mocks/balance'
import { prison } from '../../utils/mocks/prison'
import { damageObligation, offenderTransaction } from '../../utils/mocks/transactions'

import { appWithAllRoutes } from '../testutils/appSetup'

jest.mock('../../constants/featureFlags', () => ({
  Features: {
    Adjudications: 'adjudications',
    Settings: 'settings',
    Transactions: 'transactions',
    Visits: 'visits',
  },
  featureFlags: {
    transactions: {
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

const prisonService = createMockPrisonService()

const mockServices = {
  prisonService,
}

describe('GET /transactions', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    app = appWithAllRoutes({
      services: { prisonService },
    })
  })

  it('should render spends transactions', async () => {
    mockServices.prisonService.getBalances.mockResolvedValue(balances)
    mockServices.prisonService.getPrisonsByAgencyType.mockResolvedValue([prison])
    mockServices.prisonService.getTransactions.mockResolvedValue([offenderTransaction])

    const res = await request(app).get('/transactions')

    expect(res.status).toBe(200)
    expect(mockServices.prisonService.getBalances).toHaveBeenCalledWith('12345')
    expect(mockServices.prisonService.getPrisonsByAgencyType).toHaveBeenCalledWith(AgencyType.INST)
    expect(mockServices.prisonService.getTransactions).toHaveBeenCalledWith(
      expect.any(Object),
      AccountCodes.SPENDS,
      expect.any(Date),
      expect.any(Date),
    )
  })

  it('should render private transactions', async () => {
    mockServices.prisonService.getBalances.mockResolvedValue(balances)
    mockServices.prisonService.getPrisonsByAgencyType.mockResolvedValue([prison])
    mockServices.prisonService.getTransactions.mockResolvedValue([offenderTransaction])

    const res = await request(app).get('/transactions/private')

    expect(res.status).toBe(200)
    expect(mockServices.prisonService.getBalances).toHaveBeenCalledWith('12345')
    expect(mockServices.prisonService.getPrisonsByAgencyType).toHaveBeenCalledWith(AgencyType.INST)
    expect(mockServices.prisonService.getTransactions).toHaveBeenCalledWith(
      expect.any(Object),
      AccountCodes.PRIVATE,
      expect.any(Date),
      expect.any(Date),
    )
  })

  it('should render savings transactions', async () => {
    mockServices.prisonService.getBalances.mockResolvedValue(balances)
    mockServices.prisonService.getPrisonsByAgencyType.mockResolvedValue([prison])
    mockServices.prisonService.getTransactions.mockResolvedValue([offenderTransaction])

    const res = await request(app).get('/transactions/savings')

    expect(res.status).toBe(200)
    expect(mockServices.prisonService.getBalances).toHaveBeenCalledWith('12345')
    expect(mockServices.prisonService.getPrisonsByAgencyType).toHaveBeenCalledWith(AgencyType.INST)
    expect(mockServices.prisonService.getTransactions).toHaveBeenCalledWith(
      expect.any(Object),
      AccountCodes.SAVINGS,
      expect.any(Date),
      expect.any(Date),
    )
  })

  it('should render damage obligations transactions', async () => {
    mockServices.prisonService.getBalances.mockResolvedValue(balances)
    mockServices.prisonService.getPrisonsByAgencyType.mockResolvedValue([prison])
    mockServices.prisonService.getDamageObligations.mockResolvedValue({
      damageObligations: [damageObligation],
    })

    const res = await request(app).get('/transactions/damage-obligations')

    expect(res.status).toBe(200)
    expect(mockServices.prisonService.getBalances).toHaveBeenCalledWith('12345')
    expect(mockServices.prisonService.getPrisonsByAgencyType).toHaveBeenCalledWith(AgencyType.INST)
    expect(mockServices.prisonService.getDamageObligations).toHaveBeenCalledWith(expect.any(Object))
  })
})
