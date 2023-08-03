import { PrisonerProfileService, LinksService } from '..'

jest.mock('..')

export const createMockPrisonerProfileService = () =>
  new PrisonerProfileService(null, null) as jest.Mocked<PrisonerProfileService>

export const createMockLinksService = () => new LinksService(null) as jest.Mocked<LinksService>
