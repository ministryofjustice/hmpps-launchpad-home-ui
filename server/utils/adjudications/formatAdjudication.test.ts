import {
  createMockAdjucationsService,
  createMockIncentivesService,
  createMockLaunchpadAuthService,
  createMockLinksService,
  createMockLocationService,
  createMockNomisMappingService,
  createMockPrisonService,
  createMockPrisonerContactRegistryService,
} from '../../services/testutils/mocks'

import { formattedAdjudication, reportedAdjudication } from '../mocks/adjudications'
import { location } from '../mocks/location'
import { staffUser } from '../mocks/user'

import { formatAdjudication, formatHearing } from './formatAdjudication'

const services = {
  adjudicationsService: createMockAdjucationsService(),
  incentivesService: createMockIncentivesService(),
  launchpadAuthService: createMockLaunchpadAuthService(),
  linksService: createMockLinksService(),
  locationService: createMockLocationService(),
  nomisMappingService: createMockNomisMappingService(),
  prisonerContactRegistryService: createMockPrisonerContactRegistryService(),
  prisonService: createMockPrisonService(),
}

describe('formatAdjudication', () => {
  it('should format reported adjudication', async () => {
    services.prisonService.getUserById.mockResolvedValue(staffUser)
    services.locationService.getLocationById.mockResolvedValue(location)
    services.nomisMappingService.nomisToDpsLocation.mockResolvedValue({
      dpsLocationId: 'uuid',
      nomisLocationId: location.id,
    })

    const formattedReportedAdjudication = await formatAdjudication(reportedAdjudication, services)

    expect(formattedReportedAdjudication).toEqual(formattedAdjudication)
  })
})

describe('formatHearing', () => {
  it('should format hearing', async () => {
    services.locationService.getLocationById.mockResolvedValue(location)
    services.nomisMappingService.nomisToDpsLocation.mockResolvedValue({
      dpsLocationId: 'uuid',
      nomisLocationId: location.id,
    })

    const formattedHearing = await formatHearing(
      reportedAdjudication.hearings[0],
      reportedAdjudication.offenceDetails,
      [],
      services,
    )

    expect(formattedHearing).toEqual(formattedAdjudication.hearings[0])
  })
})
