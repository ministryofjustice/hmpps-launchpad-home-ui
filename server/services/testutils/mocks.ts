import { LinksService, PrisonerProfileService } from '..'

jest.mock('..')

export const createMockPrisonerProfileService = () =>
  new PrisonerProfileService(null, null, null, null, null) as jest.Mocked<PrisonerProfileService>

export const createMockLinksService = () => new LinksService() as jest.Mocked<LinksService>
