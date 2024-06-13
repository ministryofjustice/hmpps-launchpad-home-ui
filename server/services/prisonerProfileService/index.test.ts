import PrisonerProfileService from '.'

import {
  HasAdjudicationsResponse,
  PageReportedAdjudicationDto,
  ReportedAdjudicationApiResponse,
} from '../../@types/adjudicationsApiTypes'

import {
  AdjudicationsApiClient,
  HmppsAuthClient,
  IncentivesApiClient,
  PrisonApiClient,
  PrisonerContactRegistryApiClient,
  RestClientBuilder,
} from '../../data'

import { reportedAdjudication } from '../../utils/mocks/adjudications'
import { eventsSummary } from '../../utils/mocks/events'
import { incentivesReviewSummary } from '../../utils/mocks/incentives'
import { location } from '../../utils/mocks/location'
import { staffUser } from '../../utils/mocks/user'
import { prisonerContact } from '../../utils/mocks/visitors'

jest.mock('../../data')

const mockToken = 'mockToken'

describe('PrisonerProfileService', () => {
  let hmppsAuthClient: jest.Mocked<HmppsAuthClient>
  let prisonApiClientFactory: jest.MockedFunction<RestClientBuilder<PrisonApiClient>>
  let prisonApiClient: jest.Mocked<PrisonApiClient>

  let incentivesApiClientFactory: jest.MockedFunction<RestClientBuilder<IncentivesApiClient>>
  let incentivesApiClient: jest.Mocked<IncentivesApiClient>

  let adjudicationsApiClientFactory: jest.MockedFunction<RestClientBuilder<AdjudicationsApiClient>>
  let adjudicationsApiClient: jest.Mocked<AdjudicationsApiClient>

  let prisonerContactRegistryClientFactory: jest.MockedFunction<RestClientBuilder<PrisonerContactRegistryApiClient>>
  let prisonerContactRegistryApiClient: jest.Mocked<PrisonerContactRegistryApiClient>

  let prisonerProfileService: PrisonerProfileService

  beforeEach(() => {
    hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>

    prisonApiClientFactory = jest.fn()
    prisonApiClient = new PrisonApiClient(null) as jest.Mocked<PrisonApiClient>

    incentivesApiClientFactory = jest.fn()
    incentivesApiClient = new IncentivesApiClient(null) as jest.Mocked<IncentivesApiClient>

    adjudicationsApiClientFactory = jest.fn()
    adjudicationsApiClient = new AdjudicationsApiClient(null) as jest.Mocked<AdjudicationsApiClient>

    prisonerContactRegistryClientFactory = jest.fn()
    prisonerContactRegistryApiClient = new PrisonerContactRegistryApiClient(
      null,
    ) as jest.Mocked<PrisonerContactRegistryApiClient>

    prisonerProfileService = new PrisonerProfileService(
      hmppsAuthClient,
      adjudicationsApiClientFactory,
      incentivesApiClientFactory,
      prisonApiClientFactory,
      prisonerContactRegistryClientFactory,
    )
  })

  describe('getPrisonerEventsSummary', () => {
    it('should return a prisoner events summary', async () => {
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      prisonApiClientFactory.mockReturnValue(prisonApiClient)
      prisonApiClient.getEventsSummary.mockResolvedValue(eventsSummary)

      const result = await prisonerProfileService.getPrisonerEventsSummary({ idToken: { booking: { id: '123456' } } })

      expect(result).toEqual(eventsSummary)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(prisonApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(prisonApiClient.getEventsSummary).toHaveBeenCalledWith('123456')
    })
  })

  describe('getIncentivesSummaryFor', () => {
    it('should return incentives summary for the given user', async () => {
      const mockUserId = '123456'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      incentivesApiClientFactory.mockReturnValue(incentivesApiClient)
      incentivesApiClient.getIncentivesSummaryFor.mockResolvedValue(incentivesReviewSummary)

      const result = await prisonerProfileService.getIncentivesSummaryFor({
        idToken: { booking: { id: mockUserId } },
      })

      expect(result).toEqual(incentivesReviewSummary)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(incentivesApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(incentivesApiClient.getIncentivesSummaryFor).toHaveBeenCalledWith(mockUserId)
    })
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

      const result = await prisonerProfileService.hasAdjudications({
        idToken: { booking: { id: mockUserId }, establishment: { agency_id: mockAgencyId } },
      })

      expect(result).toEqual(mockHasAdjudicationsResponse)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(adjudicationsApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(adjudicationsApiClient.hasAdjudications).toHaveBeenCalledWith(mockUserId, mockAgencyId)
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

      const result = await prisonerProfileService.getReportedAdjudicationsFor(mockBookingId, mockAgencyId)

      expect(result).toEqual(mockReportedAdjudicationsData)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(adjudicationsApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(adjudicationsApiClient.getReportedAdjudicationsFor).toHaveBeenCalledWith(
        mockBookingId,
        mockAgencyId,
        mockStatusQueryParam,
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

      const result = await prisonerProfileService.getReportedAdjudication(mockChargeNumber, mockAgencyId)

      expect(result).toEqual(mockReportedAdjudication)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(adjudicationsApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(adjudicationsApiClient.getReportedAdjudication).toHaveBeenCalledWith(mockChargeNumber, mockAgencyId)
    })
  })

  describe('getUserByUserId', () => {
    it('should return a user by userId', async () => {
      const mockUserId = '123456'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      prisonApiClientFactory.mockReturnValue(prisonApiClient)
      prisonApiClient.getUserByUserId.mockResolvedValue(staffUser)

      const result = await prisonerProfileService.getUserByUserId(mockUserId)

      expect(result).toEqual(staffUser)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(prisonApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(prisonApiClient.getUserByUserId).toHaveBeenCalledWith(mockUserId)
    })
  })

  describe('getLocationByLocationId', () => {
    it('should return the location by location ID', async () => {
      const mockLocationId = 123

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      prisonApiClientFactory.mockReturnValue(prisonApiClient)
      prisonApiClient.getLocationByLocationId.mockResolvedValue(location)

      const result = await prisonerProfileService.getLocationByLocationId(mockLocationId)

      expect(result).toEqual(location)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalled()
      expect(prisonApiClientFactory).toHaveBeenCalledWith(mockToken)
      expect(prisonApiClient.getLocationByLocationId).toHaveBeenCalledWith(mockLocationId)
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
