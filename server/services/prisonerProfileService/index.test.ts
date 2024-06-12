import PrisonerProfileService from '.'
import {
  HasAdjudicationsResponse,
  PageReportedAdjudicationDto,
  ReportedAdjudicationApiResponse,
} from '../../@types/adjudicationsApiTypes'
import { IncentiveReviewSummary } from '../../@types/incentivesApiTypes'
import { EventsData } from '../../@types/launchpad'
import { Location, UserDetail } from '../../@types/prisonApiTypes'
import {
  AdjudicationsApiClient,
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
      prisonApiClientFactory,
      incentivesApiClientFactory,
      adjudicationsApiClientFactory,
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
        reportedAdjudication: {
          chargeNumber: mockChargeNumber,
          prisonerNumber: 'G2996UX',
          gender: 'MALE',
          incidentDetails: {
            locationId: 0,
            dateTimeOfIncident: '2021-07-05T10:35:17',
            dateTimeOfDiscovery: '2021-07-05T10:35:17',
            handoverDeadline: '2021-07-05T10:35:17',
          },
          isYouthOffender: true,
          incidentRole: {
            roleCode: '25a',
            offenceRule: {
              paragraphNumber: '25(a)',
              paragraphDescription: 'Committed an assault',
            },
            associatedPrisonersNumber: 'G2996UX',
            associatedPrisonersName: 'G2996UX',
          },
          offenceDetails: {
            offenceCode: 3,
            offenceRule: {
              paragraphNumber: '25(a)',
              paragraphDescription: 'Committed an assault',
              nomisCode: 'string',
              withOthersNomisCode: 'string',
            },
            victimPrisonersNumber: 'G2996UX',
            victimStaffUsername: 'ABC12D',
            victimOtherPersonsName: 'Bob Hope',
          },
          incidentStatement: {
            statement: 'string',
            completed: true,
          },
          createdByUserId: 'string',
          createdDateTime: '2021-07-05T10:35:17',
          status: 'ACCEPTED',
          reviewedByUserId: 'string',
          statusReason: 'string',
          statusDetails: 'string',
          damages: [
            {
              code: 'CLEANING',
              details: 'the kettle was broken',
              reporter: 'ABC12D',
            },
          ],
          evidence: [
            {
              code: 'PHOTO',
              identifier: 'Tag number or Camera number',
              details: 'ie what does the photo describe',
              reporter: 'ABC12D',
            },
          ],
          witnesses: [
            {
              code: 'OFFICER',
              firstName: 'Fred',
              lastName: 'Kruger',
              reporter: 'ABC12D',
            },
          ],
          hearings: [
            {
              id: 0,
              locationId: 0,
              dateTimeOfHearing: '2021-07-05T10:35:17',
              oicHearingType: 'GOV_ADULT',
              outcome: {
                id: 0,
                adjudicator: 'string',
                code: 'COMPLETE',
                reason: 'LEGAL_ADVICE',
                details: 'string',
                plea: 'UNFIT',
              },
              agencyId: 'string',
            },
          ],
          issuingOfficer: 'string',
          dateTimeOfIssue: '2021-07-05T10:35:17',
          disIssueHistory: [
            {
              issuingOfficer: 'string',
              dateTimeOfIssue: '2021-07-05T10:35:17',
            },
          ],
          dateTimeOfFirstHearing: '2021-07-05T10:35:17',
          outcomes: [
            {
              hearing: {
                id: 0,
                locationId: 0,
                dateTimeOfHearing: '2021-07-05T10:35:17',
                oicHearingType: 'GOV_ADULT',
                outcome: {
                  id: 0,
                  adjudicator: 'string',
                  code: 'COMPLETE',
                  reason: 'LEGAL_ADVICE',
                  details: 'string',
                  plea: 'UNFIT',
                },
                agencyId: 'string',
              },
              outcome: {
                outcome: {
                  id: 0,
                  code: 'REFER_POLICE',
                  details: 'string',
                  reason: 'ANOTHER_WAY',
                  quashedReason: 'FLAWED_CASE',
                  canRemove: true,
                },
                referralOutcome: {
                  id: 0,
                  code: 'REFER_POLICE',
                  details: 'string',
                  reason: 'ANOTHER_WAY',
                  quashedReason: 'FLAWED_CASE',
                  canRemove: true,
                },
              },
            },
          ],
          punishments: [
            {
              id: 0,
              type: 'PRIVILEGE',
              privilegeType: 'CANTEEN',
              otherPrivilege: 'string',
              stoppagePercentage: 0,
              activatedBy: 'string',
              activatedFrom: 'string',
              schedule: {
                days: 0,
                startDate: '2024-05-08',
                endDate: '2024-05-08',
                suspendedUntil: '2024-05-08',
              },
              consecutiveChargeNumber: 'string',
              consecutiveReportAvailable: true,
              damagesOwedAmount: 0,
              canRemove: true,
            },
          ],
          punishmentComments: [
            {
              id: 0,
              comment: 'string',
              reasonForChange: 'APPEAL',
              createdByUserId: 'string',
              dateTime: '2021-07-05T10:35:17',
            },
          ],
          outcomeEnteredInNomis: true,
          overrideAgencyId: 'string',
          originatingAgencyId: 'string',
          transferableActionsAllowed: true,
          createdOnBehalfOfOfficer: 'string',
          createdOnBehalfOfReason: 'string',
          linkedChargeNumbers: ['string'],
          canActionFromHistory: true,
        },
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

  describe('getLocationByLocationId', () => {
    it('should return the location by location ID', async () => {
      const mockLocationId = 123
      const mockLocation: Location = {
        locationId: mockLocationId,
        locationType: 'Cell',
        description: 'Cell A1',
        locationUsage: 'Standard',
        agencyId: 'ABC123',
        parentLocationId: 100,
        currentOccupancy: 2,
        locationPrefix: 'A',
        operationalCapacity: 10,
        userDescription: 'Single occupancy cell',
        internalLocationCode: 'A1',
        subLocations: false,
      }

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(mockToken)
      prisonApiClientFactory.mockReturnValue(prisonApiClient)
      prisonApiClient.getLocationByLocationId.mockResolvedValue(mockLocation)

      const result = await prisonerProfileService.getLocationByLocationId(mockLocationId)

      expect(result).toEqual(mockLocation)
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
