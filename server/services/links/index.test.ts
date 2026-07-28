import Linkservice, { isAgencyActive } from '.'
import { ifWithinActiveAgency } from './activeAgencies'

jest.mock('./activeAgencies')

jest.mock('../../config', () => ({
  ...jest.requireActual('../../config').default,
  allowBetaAccessToPrisoners: 'prisoner 1,prisoner 2,prisoner 3',
}))

describe('Linkservice', () => {
  let linkService: Linkservice

  const activeAgenciesMap: Record<string, string[]> = {
    [process.env.MANAGE_APPS_UI_URL]: ['RNI'],
    [process.env.PIN_PHONES_UI_URL]: ['RNI'],
  }

  beforeEach(() => {
    linkService = new Linkservice()

    ;(ifWithinActiveAgency as jest.Mock).mockImplementation(async (agencyId: string, serviceUrl: string) => {
      return activeAgenciesMap[serviceUrl].includes(agencyId)
    })
  })

  it('hides think through nutrition for certain establishments', async () => {
    const { links } = await linkService.getHomepageLinks(
      { idToken: { establishment: { agency_id: 'BFI' }, sub: 'prisoner 1' } },
      'en',
    )
    const thinkThroughNutritionTile = links[5]

    expect(thinkThroughNutritionTile.hidden).toBe(true)
  })

  test.each(['prisoner 1', 'prisoner 2', 'prisoner 3'])(
    'displays manage app link for allowed users in Ranby',
    async prisonerId => {
      const { links } = await linkService.getHomepageLinks(
        { idToken: { establishment: { agency_id: 'RNI' }, sub: prisonerId } },
        'en',
      )

      const manageAppsTile = links[0]
      const pinPhoneTile = links[6]

      expect(manageAppsTile.hidden).toBe(false)
      expect(pinPhoneTile.hidden).toBe(false)
    },
  )

  it('does not display manage app link for disallowed users', async () => {
    const { links } = await linkService.getHomepageLinks(
      { idToken: { establishment: { agency_id: 'RNI' }, sub: 'prisoner 4' } },
      'en',
    )

    const manageAppsTile = links[0]

    expect(manageAppsTile.hidden).toBe(true)
  })

  it('does not display manage app link for disallowed users even if available at that prison', async () => {
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
    const pinPhoneTile = links[6]

    expect(manageAppsTile.hidden).toBe(true)
    expect(pinPhoneTile.hidden).toBe(true)
  })
})

