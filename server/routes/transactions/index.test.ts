import type { Express, NextFunction, Request, Response } from 'express'
import request from 'supertest'

import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { AgencyType } from '../../constants/agency'
import { AccountCodes } from '../../constants/transactions'

import { createMockPrisonService } from '../../services/testutils/mocks'

import { balances } from '../../utils/mocks/balance'
import { prison } from '../../utils/mocks/prison'
import { damageObligation, offenderTransaction } from '../../utils/mocks/transactions'

import { appWithAllRoutes } from '../testutils/appSetup'
import { AUDIT_ACTIONS, AUDIT_PAGE_NAMES } from '../../constants/audit'

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
const auditServiceSpy = jest.spyOn(auditService, 'sendAuditMessage')

const prisonService = createMockPrisonService()

const mockServices = {
  prisonService,
}

describe('GET /transactions', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    auditServiceSpy.mockResolvedValue()
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
    expect(mockServices.prisonService.getBalances).toHaveBeenCalledWith('12345', 'sub', '67890')
    expect(mockServices.prisonService.getPrisonsByAgencyType).toHaveBeenCalledWith(AgencyType.INST, 'sub', '67890')
    expect(mockServices.prisonService.getTransactions).toHaveBeenCalledWith(
      'sub',
      AccountCodes.SPENDS,
      expect.any(Date),
      expect.any(Date),
      '67890',
    )
  })

  it('should audit spends transactions', async () => {
    mockServices.prisonService.getBalances.mockResolvedValue(balances)
    mockServices.prisonService.getPrisonsByAgencyType.mockResolvedValue([prison])
    mockServices.prisonService.getTransactions.mockResolvedValue([offenderTransaction])

    await request(app).get('/transactions')

    expect(auditServiceSpy).toHaveBeenCalledTimes(1)
    expect(auditServiceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        action: AUDIT_ACTIONS.VIEW_PAGE,
        details: expect.stringContaining(AUDIT_PAGE_NAMES.TRANSACTIONS),
      }),
    )
  })

  it('should render private transactions', async () => {
    mockServices.prisonService.getBalances.mockResolvedValue(balances)
    mockServices.prisonService.getPrisonsByAgencyType.mockResolvedValue([prison])
    mockServices.prisonService.getTransactions.mockResolvedValue([offenderTransaction])

    const res = await request(app).get('/transactions/private')

    expect(res.status).toBe(200)
    expect(mockServices.prisonService.getBalances).toHaveBeenCalledWith('12345', 'sub', '67890')
    expect(mockServices.prisonService.getPrisonsByAgencyType).toHaveBeenCalledWith(AgencyType.INST, 'sub', '67890')
    expect(mockServices.prisonService.getTransactions).toHaveBeenCalledWith(
      'sub',
      AccountCodes.PRIVATE,
      expect.any(Date),
      expect.any(Date),
      '67890',
    )
  })

  it('should audit private transactions', async () => {
    mockServices.prisonService.getBalances.mockResolvedValue(balances)
    mockServices.prisonService.getPrisonsByAgencyType.mockResolvedValue([prison])
    mockServices.prisonService.getTransactions.mockResolvedValue([offenderTransaction])

    await request(app).get('/transactions/private')

    expect(auditServiceSpy).toHaveBeenCalledTimes(1)
    expect(auditServiceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        action: AUDIT_ACTIONS.VIEW_PAGE,
        details: expect.stringContaining(AUDIT_PAGE_NAMES.TRANSACTIONS),
      }),
    )
  })

  it('should render savings transactions', async () => {
    mockServices.prisonService.getBalances.mockResolvedValue(balances)
    mockServices.prisonService.getPrisonsByAgencyType.mockResolvedValue([prison])
    mockServices.prisonService.getTransactions.mockResolvedValue([offenderTransaction])

    const res = await request(app).get('/transactions/savings')

    expect(res.status).toBe(200)
    expect(mockServices.prisonService.getBalances).toHaveBeenCalledWith('12345', 'sub', '67890')
    expect(mockServices.prisonService.getPrisonsByAgencyType).toHaveBeenCalledWith(AgencyType.INST, 'sub', '67890')
    expect(mockServices.prisonService.getTransactions).toHaveBeenCalledWith(
      'sub',
      AccountCodes.SAVINGS,
      expect.any(Date),
      expect.any(Date),
      '67890',
    )
  })

  it('should audit savings transactions', async () => {
    mockServices.prisonService.getBalances.mockResolvedValue(balances)
    mockServices.prisonService.getPrisonsByAgencyType.mockResolvedValue([prison])
    mockServices.prisonService.getTransactions.mockResolvedValue([offenderTransaction])

    await request(app).get('/transactions/savings')

    expect(auditServiceSpy).toHaveBeenCalledTimes(1)
    expect(auditServiceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        action: AUDIT_ACTIONS.VIEW_PAGE,
        details: expect.stringContaining(AUDIT_PAGE_NAMES.TRANSACTIONS),
      }),
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
    expect(mockServices.prisonService.getBalances).toHaveBeenCalledWith('12345', 'sub', '67890')
    expect(mockServices.prisonService.getPrisonsByAgencyType).toHaveBeenCalledWith(AgencyType.INST, 'sub', '67890')
    expect(mockServices.prisonService.getDamageObligations).toHaveBeenCalledWith('sub', '67890')
  })

  it('should audit damage obligations transactions', async () => {
    mockServices.prisonService.getBalances.mockResolvedValue(balances)
    mockServices.prisonService.getPrisonsByAgencyType.mockResolvedValue([prison])
    mockServices.prisonService.getDamageObligations.mockResolvedValue({
      damageObligations: [damageObligation],
    })

    await request(app).get('/transactions/damage-obligations')

    expect(auditServiceSpy).toHaveBeenCalledTimes(1)
    expect(auditServiceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        action: AUDIT_ACTIONS.VIEW_PAGE,
        details: expect.stringContaining(AUDIT_PAGE_NAMES.TRANSACTIONS),
      }),
    )
  })
})
