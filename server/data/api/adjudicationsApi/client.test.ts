import { PageReportedAdjudicationDto, ReportedAdjudicationApiResponse } from '../../../@types/adjudicationsApiTypes'
import { ApiConfig } from '../../../config'
import { reportedAdjudication } from '../../../utils/mocks/adjudications'
import RestClient from '../../restClient'
import AdjudicationsApiClient from './client'

jest.mock('../../restClient')

const mockBookingId = 'bookingId'
const mockAgencyId = 'agencyId'
const mockPrisonerId = 'prisonerId'

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

      const response = await adjudicationsApiClient.hasAdjudications(mockBookingId, mockAgencyId, mockPrisonerId)

      expect(mockRestClient.get).toHaveBeenCalledWith({
        path: `/adjudications/booking/${mockBookingId}/exists`,
        headers: {
          'Active-Caseload': mockAgencyId,
        },
      })
      expect(response).toEqual(mockResponse)
    })
  })

  describe('getReportedAdjudicationsFor', () => {
    it('should call mockRestClient.get with correct parameters', async () => {
      const mockResponse: PageReportedAdjudicationDto = {}
      ;(mockRestClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const status = 'status'
      const response = await adjudicationsApiClient.getReportedAdjudicationsFor(
        mockBookingId,
        mockAgencyId,
        status,
        mockPrisonerId,
      )

      expect(mockRestClient.get).toHaveBeenCalledWith({
        path: `/reported-adjudications/booking/${mockBookingId}?agency=${mockAgencyId}${status}&size=50`,
        headers: {
          'Active-Caseload': mockAgencyId,
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
      const response = await adjudicationsApiClient.getReportedAdjudication(chargeNumber, mockAgencyId, mockPrisonerId)

      expect(mockRestClient.get).toHaveBeenCalledWith({
        path: `/reported-adjudications/${chargeNumber}/v2`,
        headers: {
          'Active-Caseload': mockAgencyId,
        },
      })
      expect(response).toEqual(mockResponse)
    })
  })
})
