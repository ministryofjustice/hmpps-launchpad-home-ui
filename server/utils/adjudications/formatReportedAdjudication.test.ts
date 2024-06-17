import { IncidentDetailsDto } from '../../@types/adjudicationsApiTypes'

import { HmppsAuthClient } from '../../data'

import { UserService } from '../../services'
import {
  createMockAdjucationsService,
  createMockIncentivesService,
  createMockLinksService,
  createMockPrisonService,
  createMockPrisonerContactRegistryService,
} from '../../services/testutils/mocks'
import { UserDetails } from '../../services/userService'

import { formattedAdjudication, reportedAdjudication } from '../mocks/adjudications'
import { location } from '../mocks/location'
import { staffUser } from '../mocks/user'

import { formatHearing, formatIncidentDetails, formatReportedAdjudication } from './formatReportedAdjudication'

class MockUserService extends UserService {
  async getUser(_token: string): Promise<UserDetails> {
    return { name: 'Mock User', displayName: 'Mock User' }
  }
}

const services = {
  adjudicationsService: createMockAdjucationsService(),
  incentivesService: createMockIncentivesService(),
  linksService: createMockLinksService(),
  prisonerContactRegistryService: createMockPrisonerContactRegistryService(),
  prisonService: createMockPrisonService(),
  userService: new MockUserService({} as HmppsAuthClient),
}

describe('formatReportedAdjudication', () => {
  it('should format reported adjudication', async () => {
    services.prisonService.getUserByUserId.mockResolvedValue(staffUser)
    services.prisonService.getLocationByLocationId.mockResolvedValue(location)

    const formattedReportedAdjudication = await formatReportedAdjudication(reportedAdjudication, services)

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
    services.prisonService.getLocationByLocationId.mockResolvedValue(location)

    const formattedHearing = await formatHearing(
      reportedAdjudication.hearings[0],
      reportedAdjudication.offenceDetails,
      [],
      services,
    )

    expect(formattedHearing).toEqual({
      ...formattedAdjudication.hearings[0],
      location: location.userDescription,
      outcome: {
        ...formattedAdjudication.hearings[0].outcome,
        plea: 'Abstain',
      },
    })
  })
})
