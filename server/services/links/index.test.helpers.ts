import { LaunchpadUser } from '@ministryofjustice/hmpps-prisoner-auth'
import { ifWithinActiveAgency } from './activeAgencies'
import { Establishment } from '../../@types/launchpad'
import LinkService from './index'
import { getEstablishmentData } from '../../utils/utils'

const linksFor = (options: { agencyId?: string; prisonerId?: string }) => {
  const linkService = new LinkService()
  return linkService.getHomepageLinks(
    { idToken: { establishment: { agency_id: options.agencyId }, sub: options.prisonerId } } as LaunchpadUser,
    'en',
  )
}

export const expectToShowEveryTime = (tileIndex: number) => {
  describe('regardless of any other criteria', () => {
    beforeEach(() => {
      ;(ifWithinActiveAgency as jest.Mock).mockResolvedValue(false)
    })

    it('shows the tile', async () => {
      const { links } = await linksFor({ agencyId: 'XYZ', prisonerId: 'prisoner 1998' })
      expect(links[tileIndex].show).toBe(true)
    })
  })
}

export const expectToShowWhenUserWithinActiveAgencyOnly = (tileIndex: number) => {
  const activeAgenciesMap: Record<string, string[]> = {
    [process.env.MANAGE_APPS_UI_URL]: ['RNI'],
    [process.env.PIN_PHONES_UI_URL]: ['RNI'],
  }

  describe('checking for active agencies', () => {
    beforeEach(() => {
      ;(ifWithinActiveAgency as jest.Mock).mockImplementation(async (agencyId: string, serviceUrl: string) => {
        return activeAgenciesMap[serviceUrl]?.includes(agencyId)
      })
    })

    describe('when the user is not at an active agency', () => {
      it('hides the tile', async () => {
        const { links } = await linksFor({ agencyId: 'BFI', prisonerId: 'prisoner 1' })
        expect(links[tileIndex].show).toBe(false)
      })
    })

    describe('when the user is in an active agency', () => {
      it('shows the tile', async () => {
        const { links } = await linksFor({ agencyId: 'RNI', prisonerId: 'prisoner 1' })
        expect(links[tileIndex].show).toBe(true)
      })
    })
  })
}

export const expectToShowWhenUserAllowListedOnly = (tileIndex: number) => {
  describe('checking for beta testing allow listed users', () => {
    beforeEach(() => {
      ;(ifWithinActiveAgency as jest.Mock).mockResolvedValue(true)
    })

    describe('when the user is not in the allow list', () => {
      it('hides the tile', async () => {
        const { links } = await linksFor({ agencyId: 'BFI', prisonerId: 'prisoner 88' })
        expect(links[tileIndex].show).toBe(false)
      })
    })

    describe('when the user is in the allow list', () => {
      it('shows the tile', async () => {
        const { links } = await linksFor({ agencyId: 'BFI', prisonerId: 'prisoner 1' })
        expect(links[tileIndex].show).toBe(true)
      })
    })
  })
}

export const expectToShowWhenEstablishmentValueIsSetOnly = <T>(
  tileIndex: number,
  flag: keyof Establishment,
  valueRequiredToShow: T,
  exampleValueToHide: T,
) => {
  describe(`checking establishment value ${flag}`, () => {
    const establishment: Establishment = {
      agencyId: 'XYZ',
      prisonerContentHubURL: 'https://content-hub.gov.uk',
      selfServiceURL: 'https://self-service.gov.uk',
      hideInsideTime: true,
      hideThinkThroughNutrition: true,
    }

    describe(`when the value is ${valueRequiredToShow}`, () => {
      beforeEach(() => {
        ;(getEstablishmentData as jest.Mock).mockReturnValue({ ...establishment, [flag]: valueRequiredToShow })
      })

      it('shows the tile', async () => {
        const { links } = await linksFor({ agencyId: 'XYZ', prisonerId: 'prisoner 1998' })
        expect(links[tileIndex].show).toBe(true)
      })
    })

    describe(`when the value is not ${valueRequiredToShow}`, () => {
      beforeEach(() => {
        ;(getEstablishmentData as jest.Mock).mockReturnValue({ ...establishment, [flag]: exampleValueToHide })
      })

      it('hides the tile', async () => {
        const { links } = await linksFor({ agencyId: 'XYZ', prisonerId: 'prisoner 1998' })
        expect(links[tileIndex].show).toBe(false)
      })
    })
  })
}
