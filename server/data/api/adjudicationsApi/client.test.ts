import { PageReportedAdjudicationDto, ReportedAdjudicationApiResponse } from '../../../@types/adjudicationsApiTypes'
import { ApiConfig } from '../../../config'
import { reportedAdjudication } from '../../../utils/mocks/adjudications'
import RestClient from '../../restClient'
import AdjudicationsApiClient from './client'

jest.mock('../../restClient')

describe('AdjudicationsApiClient', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let adjudicationsApiClient: jest.Mocked<AdjudicationsApiClient>

  beforeEach(() => {
    const name = 'adjudicationsApiClient'
    const config = {} as ApiConfig
    const token = 'token'

    mockRestClient = new RestClient(name, config, token) as jest.Mocked<RestClient>
    adjudicationsApiClient = new AdjudicationsApiClient(null) as jest.Mocked<AdjudicationsApiClient>
    adjudicationsApiClient.restClient = mockRestClient
  })

  afterEach(() => jest.clearAllMocks())

  describe('hasAdjudications', () => {
    it('should call restClient.get with correct parameters', async () => {
      const mockResponse = true
      ;(mockRestClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const bookingId = 'bookingId'
      const agencyId = 'agencyId'
      const response = await adjudicationsApiClient.hasAdjudications(bookingId, agencyId)

      expect(mockRestClient.get).toHaveBeenCalledWith({
        path: `/adjudications/booking/${bookingId}/exists`,
        headers: {
          'Active-Caseload': agencyId,
        },
      })
      expect(response).toEqual(mockResponse)
    })
  })

  describe('getReportedAdjudicationsFor', () => {
    it('should call mockRestClient.get with correct parameters', async () => {
      const mockResponse: PageReportedAdjudicationDto = {}
      ;(mockRestClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const bookingId = 'bookingId'
      const agencyId = 'agencyId'
      const status = 'status'
      const response = await adjudicationsApiClient.getReportedAdjudicationsFor(bookingId, agencyId, status)

      expect(mockRestClient.get).toHaveBeenCalledWith({
        path: `/reported-adjudications/booking/${bookingId}?agency=${agencyId}${status}`,
        headers: {
          'Active-Caseload': agencyId,
        },
      })
      expect(response).toEqual(mockResponse)
    })
  })

  describe('getReportedAdjudication', () => {
    it('should call mockRestClient.get with correct parameters', async () => {
      const mockResponse: ReportedAdjudicationApiResponse = {
        reportedAdjudication,
      }

      ;(mockRestClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const chargeNumber = 'chargeNumber'
      const agencyId = 'agencyId'
      const response = await adjudicationsApiClient.getReportedAdjudication(chargeNumber, agencyId)

      expect(mockRestClient.get).toHaveBeenCalledWith({
        path: `/reported-adjudications/${chargeNumber}/v2`,
        headers: {
          'Active-Caseload': agencyId,
        },
      })
      expect(response).toEqual(mockResponse)
    })
  })
})
