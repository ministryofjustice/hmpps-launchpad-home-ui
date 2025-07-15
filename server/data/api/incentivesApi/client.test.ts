import { ApiConfig } from '../../../config'
import { incentivesReviewSummary } from '../../../utils/mocks/incentives'
import RestClient from '../../restClient'
import IncentivesApiClient from './client'

jest.mock('../../restClient')

const mockBookingId = 'bookingId'
const mockAgencyId = 'agencyId'
const mockPrisonerId = 'prisonerId'

describe('IncentivesApiClient', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let incentivesApiClient: jest.Mocked<IncentivesApiClient>

  beforeEach(() => {
    mockRestClient = new RestClient('incentivesApiClient', {} as ApiConfig, 'token') as jest.Mocked<RestClient>
    incentivesApiClient = new IncentivesApiClient(null) as jest.Mocked<IncentivesApiClient>
    incentivesApiClient.restClient = mockRestClient
  })

  afterEach(() => jest.clearAllMocks())

  describe('getIncentivesSummaryFor', () => {
    it('should call restClient.get with correct parameters', async () => {
      ;(mockRestClient.get as jest.Mock).mockResolvedValue(incentivesReviewSummary)

      const response = await incentivesApiClient.getIncentivesSummaryFor(mockBookingId, mockPrisonerId, mockAgencyId)

      expect(mockRestClient.get).toHaveBeenCalledWith({
        path: `/incentive-reviews/booking/${mockBookingId}`,
      })
      expect(response).toEqual(incentivesReviewSummary)
    })
  })
})
