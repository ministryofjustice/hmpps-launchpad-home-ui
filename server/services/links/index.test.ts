import Linkservice from '.'
import { HmppsAuthClient, ManageAppsClient, RestClientBuilder } from '../../data'

jest.mock('../../config', () => ({
  ...jest.requireActual('../../config').default,
  allowBetaAccessToPrisoners: 'prisoner 1, prisoner 2, prisoner 3',
}))

jest.mock('i18next', () => ({
  t: (key: string) => key,
}))

jest.mock('../../data')

afterEach(() => {
  jest.resetAllMocks()
})

describe('Linkservice', () => {
  let hmppsAuthClient: jest.Mocked<HmppsAuthClient>
  let manageAppsApiClientFactory: jest.MockedFunction<RestClientBuilder<ManageAppsClient>>
  let manageAppsApiClient: jest.Mocked<ManageAppsClient>

  let linkService: Linkservice

  beforeEach(() => {
    hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>

    manageAppsApiClientFactory = jest.fn()
    manageAppsApiClient = new ManageAppsClient(null) as jest.Mocked<ManageAppsClient>

    linkService = new Linkservice(hmppsAuthClient, manageAppsApiClientFactory)
    manageAppsApiClientFactory.mockReturnValue(manageAppsApiClient)
    manageAppsApiClient.getActiveAgencies.mockResolvedValue(['RNI'])
  })

  it('hides think through nutrition for certain establishments', async () => {
    const { links } = await linkService.getHomepageLinks(
      { idToken: { establishment: { agency_id: 'BFI' }, sub: 'prisoner 1' } },
      'en',
    )
    const thinkThroughNutritionTile = links[5]

    expect(thinkThroughNutritionTile.hidden).toBe(true)
  })

  it('displays manage app link for allowed users in Ranby', async () => {
    const { links } = await linkService.getHomepageLinks(
      { idToken: { establishment: { agency_id: 'RNI' }, sub: 'prisoner 1' } },
      'en',
    )

    const manageAppsTile = links[0]

    expect(manageAppsTile.hidden).toBe(false)
  })

  it('does not display manage app link for disallowed users', async () => {
    const { links } = await linkService.getHomepageLinks(
      { idToken: { establishment: { agency_id: 'RNI' }, sub: 'prisoner 4' } },
      'en',
    )

    const manageAppsTile = links[0]

    expect(manageAppsTile.hidden).toBe(true)
  })

  it('does not display manage app link locations other than Ranby', async () => {
    const { links } = await linkService.getHomepageLinks(
      { idToken: { establishment: { agency_id: 'BNI' }, sub: 'prisoner 1' } },
      'en',
    )

    const manageAppsTile = links[0]

    expect(manageAppsTile.hidden).toBe(true)
  })
})
