import { UserDetail } from '../@types/prisonApiTypes'
import {
  AdjudicationsApiClient,
  HmppsAuthClient,
  IncentivesApiClient,
  PrisonApiClient,
  RestClientBuilder,
} from '../data'
import PrisonerProfileService from './prisonerProfileService'

jest.mock('../data')

const mockToken = 'mockToken'

describe('PrisonerProfileService', () => {
  let hmppsAuthClient: jest.Mocked<HmppsAuthClient>
  let prisonApiClientFactory: jest.MockedFunction<RestClientBuilder<PrisonApiClient>>
  let prisonApiClient: jest.Mocked<PrisonApiClient>

  let incentivesApiClientFactory: jest.MockedFunction<RestClientBuilder<IncentivesApiClient>>
  let incentivesApiClient: jest.Mocked<IncentivesApiClient>

  let adjudicationsApiClientFactory: jest.MockedFunction<RestClientBuilder<AdjudicationsApiClient>>
  let adjudicationsApiClient: jest.Mocked<AdjudicationsApiClient>

  let prisonerProfileService: PrisonerProfileService

  beforeEach(() => {
    hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>

    prisonApiClientFactory = jest.fn()
    prisonApiClient = new PrisonApiClient(null) as jest.Mocked<PrisonApiClient>

    incentivesApiClientFactory = jest.fn()
    incentivesApiClient = new IncentivesApiClient(null) as jest.Mocked<IncentivesApiClient>

    adjudicationsApiClientFactory = jest.fn()
    adjudicationsApiClient = new AdjudicationsApiClient(null) as jest.Mocked<AdjudicationsApiClient>

    prisonerProfileService = new PrisonerProfileService(
      hmppsAuthClient,
      prisonApiClientFactory,
      incentivesApiClientFactory,
      adjudicationsApiClientFactory,
    )
  })

  describe('getUserByUserId', () => {
    it('should return a user by userId', async () => {
      const mockUserId = '123456'

      const mockUser: UserDetail = {
        staffId: 231232,
        username: 'DEMO_USER1',
        firstName: 'John',
        lastName: 'Smith',
        thumbnailId: 2342341224,
        activeCaseLoadId: 'MDI',
        accountStatus: 'ACTIVE',
        lockDate: '2021-07-05T10:35:17',
        expiryDate: '2022-07-05T10:35:17',
        lockedFlag: false,
        expiredFlag: false,
        active: true,
      }

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      prisonApiClientFactory.mockReturnValue(prisonApiClient)
      prisonApiClient.getUserByUserId.mockResolvedValue(mockUser)

      const result = await prisonerProfileService.getUserByUserId(mockUserId)

      expect(result).toEqual(mockUser)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(prisonApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(prisonApiClient.getUserByUserId).toHaveBeenCalledWith(mockUserId)
    })
  })
})
