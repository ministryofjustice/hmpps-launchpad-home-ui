import { IncidentDetailsDto } from '../../@types/adjudicationsApiTypes'
import { Location, UserDetail } from '../../@types/prisonApiTypes'
import { HmppsAuthClient } from '../../data'
import { UserService } from '../../services'
import { createMockLinksService, createMockPrisonerProfileService } from '../../services/testutils/mocks'
import { UserDetails } from '../../services/userService'
import { formatHearing, formatIncidentDetails, formatReportedAdjudication } from './formatReportedAdjudication'
import { mockFormattedAdjudication, reportedAdjudication } from './mocks'

class MockUserService extends UserService {
  async getUser(token: string): Promise<UserDetails> {
    return { name: 'Mock User', displayName: 'Mock User' }
  }
}

const mockServices = {
  userService: new MockUserService({} as HmppsAuthClient),
  prisonerProfileService: createMockPrisonerProfileService(),
  linksService: createMockLinksService(),
}

const mockUser: UserDetail = {
  staffId: 231232,
  username: 'DEMO_USER1',
  firstName: 'John',
  lastName: 'Smith',
  thumbnailId: 2342341224,
  activeCaseLoadId: 'MDI',
  accountStatus: 'ACTIVE',
  lockDate: '2021-07-05T10:35:17',
  expiryDate: '2021-12-31T23:59:59',
  lockedFlag: false,
  expiredFlag: true,
  active: true,
}

const mockLocation: Location = {
  locationId: 12345,
  locationType: 'Prison',
  description: 'Mock Location',
  locationUsage: 'Cell Block',
  agencyId: 'ABC',
  parentLocationId: 67890,
  currentOccupancy: 100,
  locationPrefix: 'MB-',
  operationalCapacity: 120,
  userDescription: 'Main Building',
  internalLocationCode: 'MB',
  subLocations: false,
}

describe('formatReportedAdjudication', () => {
  it('should format reported adjudication', async () => {
    mockServices.prisonerProfileService.getUserByUserId.mockResolvedValue(mockUser)
    mockServices.prisonerProfileService.getLocationByLocationId.mockResolvedValue(mockLocation)

    const formattedReportedAdjudication = await formatReportedAdjudication(reportedAdjudication, mockServices)

    expect(formattedReportedAdjudication).toEqual(formattedReportedAdjudication)
  })
})

describe('formatIncidentDetails', () => {
  it('should format incident details', () => {
    const incidentDetails: IncidentDetailsDto = {
      locationId: 1,
      handoverDeadline: '',
      dateTimeOfIncident: '2021-01-01',
      dateTimeOfDiscovery: '2021-01-02',
    }

    const formattedDetails = formatIncidentDetails(incidentDetails)

    expect(formattedDetails).toEqual({
      ...incidentDetails,
      dateTimeOfIncident: '1 January 2021, 12.00am',
      dateTimeOfDiscovery: '2 January 2021, 12.00am',
    })
  })
})

describe('formatHearing', () => {
  it('should format hearing', async () => {
    mockServices.prisonerProfileService.getLocationByLocationId.mockResolvedValue(mockLocation)

    const formattedHearing = await formatHearing(
      reportedAdjudication.hearings[0],
      reportedAdjudication.offenceDetails,
      [],
      mockServices,
    )

    expect(formattedHearing).toEqual({
      ...mockFormattedAdjudication.hearings[0],
      location: mockLocation.userDescription,
      outcome: {
        ...mockFormattedAdjudication.hearings[0].outcome,
        plea: 'Abstain',
      },
    })
  })
})
