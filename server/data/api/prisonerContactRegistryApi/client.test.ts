import { ApiConfig } from '../../../config'
import { prisonerContact } from '../../../utils/mocks/visitors'
import RestClient from '../../restClient'
import PrisonerContactRegistryApiClient from './client'

jest.mock('../../restClient')

describe('PrisonerContactRegistryApiClient', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let prisonerContactRegistryApiClient: jest.Mocked<PrisonerContactRegistryApiClient>

  beforeEach(() => {
    mockRestClient = new RestClient(
      'prisonContactRegistryApiClient',
      {} as ApiConfig,
      'token',
    ) as jest.Mocked<RestClient>

    prisonerContactRegistryApiClient = new PrisonerContactRegistryApiClient(
      null,
    ) as jest.Mocked<PrisonerContactRegistryApiClient>

    prisonerContactRegistryApiClient.restClient = mockRestClient
  })

  afterEach(() => jest.clearAllMocks())

  describe('getSocialVisitors', () => {
    it('should call restClient.get with correct parameters', async () => {
      ;(mockRestClient.get as jest.Mock).mockResolvedValue(prisonerContact)

      const response = await prisonerContactRegistryApiClient.getSocialVisitors('prisonerId')

      expect(mockRestClient.get).toHaveBeenCalledWith({
        path: `/prisoners/prisonerId/contacts?type=S`,
      })
      expect(response).toEqual(prisonerContact)
    })
  })
})
