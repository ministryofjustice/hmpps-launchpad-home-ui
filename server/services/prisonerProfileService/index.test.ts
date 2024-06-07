import PrisonerProfileService from '.'
import { IncentiveReviewSummary } from '../../@types/incentivesApiTypes'
import { EventsData } from '../../@types/launchpad'
import {
  HmppsAuthClient,
  IncentivesApiClient,
  PrisonApiClient,
  PrisonerContactRegistryApiClient,
  RestClientBuilder,
} from '../../data'
import { prisonerContact } from '../../utils/mocks/visitors'

jest.mock('../../data')

const mockToken = 'mockToken'

describe('PrisonerProfileService', () => {
  let hmppsAuthClient: jest.Mocked<HmppsAuthClient>
  let prisonApiClientFactory: jest.MockedFunction<RestClientBuilder<PrisonApiClient>>
  let prisonApiClient: jest.Mocked<PrisonApiClient>

  let incentivesApiClientFactory: jest.MockedFunction<RestClientBuilder<IncentivesApiClient>>
  let incentivesApiClient: jest.Mocked<IncentivesApiClient>

  let prisonerContactRegistryClientFactory: jest.MockedFunction<RestClientBuilder<PrisonerContactRegistryApiClient>>
  let prisonerContactRegistryApiClient: jest.Mocked<PrisonerContactRegistryApiClient>

  let prisonerProfileService: PrisonerProfileService

  beforeEach(() => {
    hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>

    prisonApiClientFactory = jest.fn()
    prisonApiClient = new PrisonApiClient(null) as jest.Mocked<PrisonApiClient>

    incentivesApiClientFactory = jest.fn()
    incentivesApiClient = new IncentivesApiClient(null) as jest.Mocked<IncentivesApiClient>

    prisonerContactRegistryClientFactory = jest.fn()
    prisonerContactRegistryApiClient = new PrisonerContactRegistryApiClient(
      null,
    ) as jest.Mocked<PrisonerContactRegistryApiClient>

    prisonerProfileService = new PrisonerProfileService(
      hmppsAuthClient,
      prisonApiClientFactory,
      incentivesApiClientFactory,
      prisonerContactRegistryClientFactory,
    )
  })

  describe('getPrisonerEventsSummary', () => {
    it('should return a prisoner events summary', async () => {
      const mockEventsSummary: EventsData = {
        isTomorrow: false,
        error: false,
        prisonerEvents: [
          {
            timeString: '10:00 AM',
            description: 'Morning Exercise',
            location: 'Gymnasium',
          },
          {
            timeString: '12:00 PM',
            description: 'Lunch',
            location: 'Cafeteria',
          },
          {
            timeString: '2:00 PM',
            description: 'Educational Program',
            location: 'Classroom A',
          },
        ],
      }

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      prisonApiClientFactory.mockReturnValue(prisonApiClient)
      prisonApiClient.getEventsSummary.mockResolvedValue(mockEventsSummary)

      const result = await prisonerProfileService.getPrisonerEventsSummary({ idToken: { booking: { id: '123456' } } })

      expect(result).toEqual(mockEventsSummary)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(prisonApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(prisonApiClient.getEventsSummary).toHaveBeenCalledWith('123456')
    })
  })

  describe('getIncentivesSummaryFor', () => {
    it('should return incentives summary for the given user', async () => {
      const mockUserId = '123456'
      const mockIncentivesData: IncentiveReviewSummary = {
        id: 12345,
        iepCode: 'STD',
        iepLevel: 'Standard',
        prisonerNumber: 'A1234BC',
        bookingId: 1234567,
        iepDate: '2021-12-31',
        iepTime: '2021-07-05T10:35:17',
        locationId: '1-2-003',
        iepDetails: [],
        nextReviewDate: '2022-12-31',
        daysSinceReview: 23,
      }

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      incentivesApiClientFactory.mockReturnValue(incentivesApiClient)
      incentivesApiClient.getIncentivesSummaryFor.mockResolvedValue(mockIncentivesData)

      const result = await prisonerProfileService.getIncentivesSummaryFor({
        idToken: { booking: { id: mockUserId } },
      })

      expect(result).toEqual(mockIncentivesData)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(incentivesApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(incentivesApiClient.getIncentivesSummaryFor).toHaveBeenCalledWith(mockUserId)
    })
  })

  describe('getSocialVisitors', () => {
    it('should return an array of social visitors for a given prisonerId', async () => {
      const prisonerId = 'prisonerId'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      prisonerContactRegistryClientFactory.mockReturnValue(prisonerContactRegistryApiClient)
      prisonerContactRegistryApiClient.getSocialVisitors.mockResolvedValue([prisonerContact])

      const result = await prisonerProfileService.getSocialVisitors(prisonerId)

      expect(result).toEqual([prisonerContact])
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(prisonerContactRegistryClientFactory).toHaveBeenCalledWith(mockToken)
      expect(prisonerContactRegistryApiClient.getSocialVisitors).toHaveBeenCalledWith(prisonerId)
    })
  })
})
