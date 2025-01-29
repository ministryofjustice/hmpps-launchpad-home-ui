import PrisonService from '.'

import { HmppsAuthClient, PrisonApiClient, RestClientBuilder } from '../../data'

import { eventsSummary } from '../../utils/mocks/events'
import { staffUser } from '../../utils/mocks/user'
import { visitBalances } from '../../utils/mocks/visitors'

jest.mock('../../data')

const mockToken = 'mockToken'
const defaultLanguage = 'en'

describe('PrisonerProfileService', () => {
  let hmppsAuthClient: jest.Mocked<HmppsAuthClient>
  let prisonApiClientFactory: jest.MockedFunction<RestClientBuilder<PrisonApiClient>>
  let prisonApiClient: jest.Mocked<PrisonApiClient>

  let prisonService: PrisonService

  beforeEach(() => {
    hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>

    prisonApiClientFactory = jest.fn()
    prisonApiClient = new PrisonApiClient(null) as jest.Mocked<PrisonApiClient>

    prisonService = new PrisonService(hmppsAuthClient, prisonApiClientFactory)
  })

  describe('getPrisonerEventsSummary', () => {
    it('should return a prisoner events summary', async () => {
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      prisonApiClientFactory.mockReturnValue(prisonApiClient)
      prisonApiClient.getEventsSummary.mockResolvedValue(eventsSummary)

      const result = await prisonService.getPrisonerEventsSummary('123456', defaultLanguage)

      expect(result).toEqual(eventsSummary)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(prisonApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(prisonApiClient.getEventsSummary).toHaveBeenCalledWith('123456', defaultLanguage)
    })
  })

  describe('getUserById', () => {
    it('should return a user by userId', async () => {
      const mockUserId = '123456'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      prisonApiClientFactory.mockReturnValue(prisonApiClient)
      prisonApiClient.getUserById.mockResolvedValue(staffUser)

      const result = await prisonService.getUserById(mockUserId)

      expect(result).toEqual(staffUser)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(prisonApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(prisonApiClient.getUserById).toHaveBeenCalledWith(mockUserId)
    })
  })

  describe('getVisitBalances', () => {
    it('should return the visit balances for the prisoner', async () => {
      const prisonerId = '12345'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      prisonApiClientFactory.mockReturnValue(prisonApiClient)
      prisonApiClient.getVisitBalances.mockResolvedValue(visitBalances)

      const result = await prisonService.getVisitBalances(prisonerId)

      expect(result).toEqual(visitBalances)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(prisonApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(prisonApiClient.getVisitBalances).toHaveBeenCalledWith(prisonerId)
    })
  })
})
