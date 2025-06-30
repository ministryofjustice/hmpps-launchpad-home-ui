import { TelemetryClient } from 'applicationinsights'
import {
  AdjudicationsService,
  IncentivesService,
  LaunchpadAuthService,
  LinksService,
  LocationService,
  NomisMappingService,
  PrisonService,
  PrisonerContactRegistryService,
  CustomEventService,
} from '..'

jest.mock('..')
jest.mock('applicationinsights')

export const createMockAdjucationsService = () =>
  new AdjudicationsService(null, null) as jest.Mocked<AdjudicationsService>

export const createMockLinksService = () => new LinksService() as jest.Mocked<LinksService>

export const createMockLocationService = () => new LocationService(null, null) as jest.Mocked<LocationService>

export const createMockIncentivesService = () => new IncentivesService(null, null) as jest.Mocked<IncentivesService>

export const createMockNomisMappingService = () =>
  new NomisMappingService(null, null) as jest.Mocked<NomisMappingService>

export const createMockPrisonService = () => new PrisonService(null, null) as jest.Mocked<PrisonService>

export const createMockPrisonerContactRegistryService = () =>
  new PrisonerContactRegistryService(null, null) as jest.Mocked<PrisonerContactRegistryService>

export const createMockLaunchpadAuthService = () =>
  new LaunchpadAuthService(null, null) as jest.Mocked<LaunchpadAuthService>

export const createMockCustomEventService = () =>
  new CustomEventService(new TelemetryClient()) as jest.Mocked<CustomEventService>
