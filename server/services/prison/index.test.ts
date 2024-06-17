import PrisonService from '.'

import { HmppsAuthClient, PrisonApiClient, RestClientBuilder } from '../../data'

import { eventsSummary } from '../../utils/mocks/events'
import { location } from '../../utils/mocks/location'
import { staffUser } from '../../utils/mocks/user'

jest.mock('../../data')

const mockToken = 'mockToken'

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

      const result = await prisonService.getPrisonerEventsSummary({ idToken: { booking: { id: '123456' } } })

      expect(result).toEqual(eventsSummary)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(prisonApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(prisonApiClient.getEventsSummary).toHaveBeenCalledWith('123456')
    })
  })

  describe('getUserByUserId', () => {
    it('should return a user by userId', async () => {
      const mockUserId = '123456'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      prisonApiClientFactory.mockReturnValue(prisonApiClient)
      prisonApiClient.getUserByUserId.mockResolvedValue(staffUser)

      const result = await prisonService.getUserByUserId(mockUserId)

      expect(result).toEqual(staffUser)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(prisonApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(prisonApiClient.getUserByUserId).toHaveBeenCalledWith(mockUserId)
    })
  })

  describe('getLocationByLocationId', () => {
    it('should return the location by location ID', async () => {
      const mockLocationId = 123

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      prisonApiClientFactory.mockReturnValue(prisonApiClient)
      prisonApiClient.getLocationByLocationId.mockResolvedValue(location)

      const result = await prisonService.getLocationByLocationId(mockLocationId)

      expect(result).toEqual(location)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(prisonApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(prisonApiClient.getLocationByLocationId).toHaveBeenCalledWith(mockLocationId)
    })
  })
})
