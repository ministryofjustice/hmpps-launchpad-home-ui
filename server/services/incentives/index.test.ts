import IncentivesService from '.'
import { HmppsAuthClient, IncentivesApiClient, RestClientBuilder } from '../../data'
import { incentivesReviewSummary } from '../../utils/mocks/incentives'

jest.mock('../../data')

const mockToken = 'mockToken'

describe('PrisonerProfileService', () => {
  let hmppsAuthClient: jest.Mocked<HmppsAuthClient>

  let incentivesApiClientFactory: jest.MockedFunction<RestClientBuilder<IncentivesApiClient>>
  let incentivesApiClient: jest.Mocked<IncentivesApiClient>

  let incentivesService: IncentivesService

  beforeEach(() => {
    hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>

    incentivesApiClientFactory = jest.fn()
    incentivesApiClient = new IncentivesApiClient(null) as jest.Mocked<IncentivesApiClient>

    incentivesService = new IncentivesService(hmppsAuthClient, incentivesApiClientFactory)
  })

  describe('getIncentivesSummaryFor', () => {
    it('should return incentives summary for the given user', async () => {
      const mockUserId = '123456'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      incentivesApiClientFactory.mockReturnValue(incentivesApiClient)
      incentivesApiClient.getIncentivesSummaryFor.mockResolvedValue(incentivesReviewSummary)

      const result = await incentivesService.getIncentivesSummaryFor({
        idToken: { booking: { id: mockUserId } },
      })

      expect(result).toEqual(incentivesReviewSummary)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(incentivesApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(incentivesApiClient.getIncentivesSummaryFor).toHaveBeenCalledWith(mockUserId)
    })
  })
})
