import PrisonerContactRegistryService from '.'
import { HmppsAuthClient, PrisonerContactRegistryApiClient, RestClientBuilder } from '../../data'
import { prisonerContact } from '../../utils/mocks/visitors'

jest.mock('../../data')

const mockToken = 'mockToken'

describe('PrisonerProfileService', () => {
  let hmppsAuthClient: jest.Mocked<HmppsAuthClient>

  let prisonerContactRegistryClientFactory: jest.MockedFunction<RestClientBuilder<PrisonerContactRegistryApiClient>>
  let prisonerContactRegistryApiClient: jest.Mocked<PrisonerContactRegistryApiClient>

  let prisonerContactRegistryService: PrisonerContactRegistryService

  beforeEach(() => {
    hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>

    prisonerContactRegistryClientFactory = jest.fn()
    prisonerContactRegistryApiClient = new PrisonerContactRegistryApiClient(
      null,
    ) as jest.Mocked<PrisonerContactRegistryApiClient>

    prisonerContactRegistryService = new PrisonerContactRegistryService(
      hmppsAuthClient,
      prisonerContactRegistryClientFactory,
    )
  })

  describe('getSocialVisitors', () => {
    it('should return an array of social visitors for a given prisonerId', async () => {
      const prisonerId = 'prisonerId'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      prisonerContactRegistryClientFactory.mockReturnValue(prisonerContactRegistryApiClient)
      prisonerContactRegistryApiClient.getSocialVisitors.mockResolvedValue([prisonerContact])

      const result = await prisonerContactRegistryService.getSocialVisitors(prisonerId)

      expect(result).toEqual([prisonerContact])
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(prisonerContactRegistryClientFactory).toHaveBeenCalledWith(mockToken)
      expect(prisonerContactRegistryApiClient.getSocialVisitors).toHaveBeenCalledWith(prisonerId)
    })
  })
})
