import { IncidentDetailsDto } from '../../@types/adjudicationsApiTypes'

import {
  createMockAdjucationsService,
  createMockIncentivesService,
  createMockLaunchpadAuthService,
  createMockLinksService,
  createMockPrisonService,
  createMockPrisonerContactRegistryService,
} from '../../services/testutils/mocks'

import { formattedAdjudication, reportedAdjudication } from '../mocks/adjudications'
import { location } from '../mocks/location'
import { staffUser } from '../mocks/user'

import { formatAdjudication, formatHearing, formatIncidentDetails } from './formatAdjudication'

const services = {
  adjudicationsService: createMockAdjucationsService(),
  incentivesService: createMockIncentivesService(),
  launchpadAuthService: createMockLaunchpadAuthService(),
  linksService: createMockLinksService(),
  prisonerContactRegistryService: createMockPrisonerContactRegistryService(),
  prisonService: createMockPrisonService(),
}

describe('formatAdjudication', () => {
  it('should format reported adjudication', async () => {
    services.prisonService.getUserById.mockResolvedValue(staffUser)
    services.prisonService.getLocationById.mockResolvedValue(location)

    const formattedReportedAdjudication = await formatAdjudication(reportedAdjudication, services)

    expect(formattedReportedAdjudication).toEqual(formattedAdjudication)
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
      adjudicator: 'IQS13Z',
      oicHearingType: 'Adult',
      location: location.userDescription,
      outcome: {
        ...formattedAdjudication.hearings[0].outcome,
        plea: 'Abstain',
      },
    })
  })
})
