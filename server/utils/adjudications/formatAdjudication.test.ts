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
import { UserDetails } from '../../services/user'

import { formattedAdjudication, reportedAdjudication } from '../mocks/adjudications'
import { location } from '../mocks/location'
import { staffUser } from '../mocks/user'

import { formatHearing, formatIncidentDetails, formatAdjudication } from './formatAdjudication'

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

describe('formatAdjudication', () => {
  it('should format reported adjudication', async () => {
    services.prisonService.getUserById.mockResolvedValue(staffUser)
    services.prisonService.getLocationById.mockResolvedValue(location)

    const formattedReportedAdjudication = await formatAdjudication(reportedAdjudication, services)

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
    services.prisonService.getLocationById.mockResolvedValue(location)

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
