import { LaunchpadUser } from '@ministryofjustice/hmpps-prisoner-auth'
import LinkService from '.'
import { ifWithinActiveAgency } from './activeAgencies'

jest.mock('./activeAgencies')

jest.mock('../../config', () => ({
  ...jest.requireActual('../../config').default,
  allowBetaAccessToPrisoners: 'prisoner 1,prisoner 2,prisoner 3',
}))

describe('LinkService', () => {
  let linkService: LinkService

  const activeAgenciesMap: Record<string, string[]> = {
    [process.env.MANAGE_APPS_UI_URL]: ['RNI'],
    [process.env.PIN_PHONES_UI_URL]: ['RNI'],
  }

  beforeEach(() => {
    linkService = new LinkService()

    ;(ifWithinActiveAgency as jest.Mock).mockImplementation(async (agencyId: string, serviceUrl: string) => {
      return activeAgenciesMap[serviceUrl].includes(agencyId)
    })
  })

  it('hides think through nutrition for certain establishments', async () => {
    const { links } = await linkService.getHomepageLinks(
      { idToken: { establishment: { agency_id: 'BFI' }, sub: 'prisoner 1' } } as LaunchpadUser,
      'en',
    )
    const thinkThroughNutritionTile = links[5]

    expect(thinkThroughNutritionTile.show).toBe(false)
  })

  test.each(['prisoner 1', 'prisoner 2', 'prisoner 3'])(
    'displays manage app link for allowed users in Ranby',
    async prisonerId => {
      const { links } = await linkService.getHomepageLinks(
        { idToken: { establishment: { agency_id: 'RNI' }, sub: prisonerId } } as LaunchpadUser,
        'en',
      )

      const manageAppsTile = links[0]
      const pinPhoneTile = links[6]

      expect(manageAppsTile.show).toBe(true)
      expect(pinPhoneTile.show).toBe(true)
    },
  )

  it('does not display manage app link for disallowed users', async () => {
    const { links } = await linkService.getHomepageLinks(
      { idToken: { establishment: { agency_id: 'RNI' }, sub: 'prisoner 4' } } as LaunchpadUser,
      'en',
    )

    const manageAppsTile = links[0]

    expect(manageAppsTile.show).toBe(false)
  })

  it('does not display manage app link for disallowed users even if available at that prison', async () => {
    const { links } = await linkService.getHomepageLinks(
      { idToken: { establishment: { agency_id: 'RNI' }, sub: 'prisoner 4' } } as LaunchpadUser,
      'en',
    )

    const manageAppsTile = links[0]

    expect(manageAppsTile.show).toBe(false)
  })

  it('does not display manage app link locations other than Ranby', async () => {
    const { links } = await linkService.getHomepageLinks(
      { idToken: { establishment: { agency_id: 'BNI' }, sub: 'prisoner 1' } } as LaunchpadUser,
      'en',
    )

    const manageAppsTile = links[0]
    const pinPhoneTile = links[6]

    expect(manageAppsTile.show).toBe(false)
    expect(pinPhoneTile.show).toBe(false)
  })
})
