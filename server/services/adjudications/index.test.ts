import AdjudicationsService from '.'

import {
  HasAdjudicationsResponse,
  PageReportedAdjudicationDto,
  ReportedAdjudicationApiResponse,
} from '../../@types/adjudicationsApiTypes'

import { AdjudicationsApiClient, HmppsAuthClient, RestClientBuilder } from '../../data'

import { reportedAdjudication } from '../../utils/mocks/adjudications'

jest.mock('../../data')

const mockToken = 'mockToken'
const mockPrisonerId = 'prisonerId'

describe('PrisonerProfileService', () => {
  let hmppsAuthClient: jest.Mocked<HmppsAuthClient>

  let adjudicationsApiClientFactory: jest.MockedFunction<RestClientBuilder<AdjudicationsApiClient>>
  let adjudicationsApiClient: jest.Mocked<AdjudicationsApiClient>

  let adjudicationsService: AdjudicationsService

  beforeEach(() => {
    hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>

    adjudicationsApiClientFactory = jest.fn()
    adjudicationsApiClient = new AdjudicationsApiClient(null) as jest.Mocked<AdjudicationsApiClient>

    adjudicationsService = new AdjudicationsService(hmppsAuthClient, adjudicationsApiClientFactory)
  })

  describe('hasAdjudications', () => {
    it('should return whether the user has adjudications', async () => {
      const mockUserId = '123456'
      const mockAgencyId = 'ABC'
      const mockHasAdjudicationsResponse: HasAdjudicationsResponse = {
        hasAdjudications: true,
      }

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      adjudicationsApiClientFactory.mockReturnValue(adjudicationsApiClient)
      adjudicationsApiClient.hasAdjudications.mockResolvedValue(mockHasAdjudicationsResponse)

      const result = await adjudicationsService.hasAdjudications(mockUserId, mockAgencyId, mockPrisonerId)

      expect(result).toEqual(mockHasAdjudicationsResponse)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(adjudicationsApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(adjudicationsApiClient.hasAdjudications).toHaveBeenCalledWith(mockUserId, mockAgencyId, mockPrisonerId)
    })
  })

  describe('getReportedAdjudicationsFor', () => {
    it('should return reported adjudications for the given user', async () => {
      const mockBookingId = '123456'
      const mockAgencyId = 'XYZ456'
      const mockStatusQueryParam =
        '&status=ACCEPTED&status=REJECTED&status=AWAITING_REVIEW&status=RETURNED&status=UNSCHEDULED&status=SCHEDULED&status=REFER_POLICE&status=REFER_INAD&status=REFER_GOV&status=PROSECUTION&status=DISMISSED&status=NOT_PROCEED&status=ADJOURNED&status=CHARGE_PROVED&status=QUASHED&status=INVALID_OUTCOME&status=INVALID_SUSPENDED&status=INVALID_ADA'

      const mockReportedAdjudicationsData: PageReportedAdjudicationDto = {
        content: [],
      }

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      adjudicationsApiClientFactory.mockReturnValue(adjudicationsApiClient)
      adjudicationsApiClient.getReportedAdjudicationsFor.mockResolvedValue(mockReportedAdjudicationsData)

      const result = await adjudicationsService.getReportedAdjudicationsFor(
        mockBookingId,
        mockAgencyId,
        'en',
        mockPrisonerId,
      )

      expect(result).toEqual(mockReportedAdjudicationsData)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(adjudicationsApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(adjudicationsApiClient.getReportedAdjudicationsFor).toHaveBeenCalledWith(
        mockBookingId,
        mockAgencyId,
        mockStatusQueryParam,
        mockPrisonerId,
      )
    })
  })

  describe('getReportedAdjudication', () => {
    it('should return the reported adjudication for the given charge number and agency ID', async () => {
      const mockChargeNumber = 'ABC123'
      const mockAgencyId = 'XYZ456'
      const mockReportedAdjudication: ReportedAdjudicationApiResponse = {
        reportedAdjudication,
      }

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      adjudicationsApiClientFactory.mockReturnValue(adjudicationsApiClient)
      adjudicationsApiClient.getReportedAdjudication.mockResolvedValue(mockReportedAdjudication)

      const result = await adjudicationsService.getReportedAdjudication(mockChargeNumber, mockAgencyId, mockPrisonerId)

      expect(result).toEqual(mockReportedAdjudication)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(adjudicationsApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(adjudicationsApiClient.getReportedAdjudication).toHaveBeenCalledWith(
        mockChargeNumber,
        mockAgencyId,
        mockPrisonerId,
      )
    })
  })
})
