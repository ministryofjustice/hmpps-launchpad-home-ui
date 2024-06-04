import type { Express } from 'express'
import request from 'supertest'

import { AgencyType } from '../../constants/agency'
import { AccountCodes } from '../../constants/transactions'
import { createMockPrisonerProfileService } from '../../services/testutils/mocks'
import { balances } from '../../utils/mocks/balance'
import { prison } from '../../utils/mocks/prison'
import { damageObligation, offenderTransaction } from '../../utils/mocks/transactions'
import { appWithAllRoutes } from '../testutils/appSetup'

let app: Express

const prisonerProfileService = createMockPrisonerProfileService()

const mockServices = {
  prisonerProfileService,
}

describe('GET /transactions', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    app = appWithAllRoutes({
      services: { prisonerProfileService },
    })
  })

  it('should render spends transactions', async () => {
    mockServices.prisonerProfileService.getBalances.mockResolvedValue(balances)
    mockServices.prisonerProfileService.getPrisonsByAgencyType.mockResolvedValue([prison])
    mockServices.prisonerProfileService.getTransactions.mockResolvedValue([offenderTransaction])

    const res = await request(app).get('/transactions')

    expect(res.status).toBe(200)
    expect(mockServices.prisonerProfileService.getBalances).toHaveBeenCalledWith('12345')
    expect(mockServices.prisonerProfileService.getPrisonsByAgencyType).toHaveBeenCalledWith(AgencyType.INST)
    expect(mockServices.prisonerProfileService.getTransactions).toHaveBeenCalledWith(
      expect.any(Object),
      AccountCodes.SPENDS,
      expect.any(Date),
      expect.any(Date),
    )
  })

  it('should render private transactions', async () => {
    mockServices.prisonerProfileService.getBalances.mockResolvedValue(balances)
    mockServices.prisonerProfileService.getPrisonsByAgencyType.mockResolvedValue([prison])
    mockServices.prisonerProfileService.getTransactions.mockResolvedValue([offenderTransaction])

    const res = await request(app).get('/transactions/private')

    expect(res.status).toBe(200)
    expect(mockServices.prisonerProfileService.getBalances).toHaveBeenCalledWith('12345')
    expect(mockServices.prisonerProfileService.getPrisonsByAgencyType).toHaveBeenCalledWith(AgencyType.INST)
    expect(mockServices.prisonerProfileService.getTransactions).toHaveBeenCalledWith(
      expect.any(Object),
      AccountCodes.PRIVATE,
      expect.any(Date),
      expect.any(Date),
    )
  })

  it('should render savings transactions', async () => {
    mockServices.prisonerProfileService.getBalances.mockResolvedValue(balances)
    mockServices.prisonerProfileService.getPrisonsByAgencyType.mockResolvedValue([prison])
    mockServices.prisonerProfileService.getTransactions.mockResolvedValue([offenderTransaction])

    const res = await request(app).get('/transactions/savings')

    expect(res.status).toBe(200)
    expect(mockServices.prisonerProfileService.getBalances).toHaveBeenCalledWith('12345')
    expect(mockServices.prisonerProfileService.getPrisonsByAgencyType).toHaveBeenCalledWith(AgencyType.INST)
    expect(mockServices.prisonerProfileService.getTransactions).toHaveBeenCalledWith(
      expect.any(Object),
      AccountCodes.SAVINGS,
      expect.any(Date),
      expect.any(Date),
    )
  })

  it('should render damage obligations transactions', async () => {
    mockServices.prisonerProfileService.getBalances.mockResolvedValue(balances)
    mockServices.prisonerProfileService.getPrisonsByAgencyType.mockResolvedValue([prison])
    mockServices.prisonerProfileService.getDamageObligations.mockResolvedValue({
      damageObligations: [damageObligation],
    })

    const res = await request(app).get('/transactions/damage-obligations')

    expect(res.status).toBe(200)
    expect(mockServices.prisonerProfileService.getBalances).toHaveBeenCalledWith('12345')
    expect(mockServices.prisonerProfileService.getPrisonsByAgencyType).toHaveBeenCalledWith(AgencyType.INST)
    expect(mockServices.prisonerProfileService.getDamageObligations).toHaveBeenCalledWith(expect.any(Object))
  })
})
