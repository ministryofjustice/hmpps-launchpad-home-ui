import {
  AdjudicationsService,
  IncentivesService,
  LaunchpadAuthService,
  LinksService,
  PrisonService,
  PrisonerContactRegistryService,
} from '..'

jest.mock('..')

export const createMockAdjucationsService = () =>
  new AdjudicationsService(null, null) as jest.Mocked<AdjudicationsService>

export const createMockLinksService = () => new LinksService() as jest.Mocked<LinksService>

export const createMockIncentivesService = () => new IncentivesService(null, null) as jest.Mocked<IncentivesService>

export const createMockPrisonService = () => new PrisonService(null, null) as jest.Mocked<PrisonService>

export const createMockPrisonerContactRegistryService = () =>
  new PrisonerContactRegistryService(null, null) as jest.Mocked<PrisonerContactRegistryService>

export const createMockLaunchadAuthService = () =>
  new LaunchpadAuthService(null, null) as jest.Mocked<LaunchpadAuthService>
