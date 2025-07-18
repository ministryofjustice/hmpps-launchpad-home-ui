import LaunchpadAuthService from '.'
import { HmppsAuthClient, LaunchpadAuthClient, RestClientBuilder } from '../../data'
import { client } from '../../utils/mocks/client'

jest.mock('../../data')

const accessToken = 'access_token'
const clientId = 'client'
const token = 'token'
const prisonerId = 'prisonerId'
const agencyId = 'agencyId'

describe('LaunchpadAuthService', () => {
  let hmppsAuthClient: jest.Mocked<HmppsAuthClient>

  let launchpadAuthClientFactory: jest.MockedFunction<RestClientBuilder<LaunchpadAuthClient>>
  let launchpadAuthClient: jest.Mocked<LaunchpadAuthClient>

  let launchpadAuthService: LaunchpadAuthService

  beforeEach(() => {
    hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>

    launchpadAuthClientFactory = jest.fn()
    launchpadAuthClient = new LaunchpadAuthClient(null) as jest.Mocked<LaunchpadAuthClient>

    launchpadAuthService = new LaunchpadAuthService(hmppsAuthClient, launchpadAuthClientFactory)
  })

  describe('getApprovedClients', () => {
    it('should return the approved clients for a user', async () => {
      const response = {
        page: 1,
        exhausted: true,
        totalElements: 1,
        content: [client],
      }

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
      launchpadAuthClientFactory.mockReturnValue(launchpadAuthClient)
      launchpadAuthClient.getApprovedClients.mockResolvedValue(response)

      const result = await launchpadAuthService.getApprovedClients(prisonerId, agencyId, accessToken)

      expect(result).toEqual(response)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(launchpadAuthClientFactory).toHaveBeenCalledWith(token)
      expect(launchpadAuthClient.getApprovedClients).toHaveBeenCalledWith(prisonerId, agencyId, accessToken)
    })
  })

  describe('removeClientAccess', () => {
    it('should remove access to a client for a user', async () => {
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
      launchpadAuthClientFactory.mockReturnValue(launchpadAuthClient)
      launchpadAuthClient.removeClientAccess.mockResolvedValue(undefined)

      const result = await launchpadAuthService.removeClientAccess(clientId, prisonerId, agencyId, accessToken)

      expect(result).toBe(undefined)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(launchpadAuthClientFactory).toHaveBeenCalledWith(token)
      expect(launchpadAuthClient.removeClientAccess).toHaveBeenCalledWith(clientId, prisonerId, agencyId, accessToken)
    })
  })
})
