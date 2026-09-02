import i18next from 'i18next'
import { LaunchpadUser } from '@ministryofjustice/hmpps-prisoner-auth'
import { Link } from '../../@types/launchpad'
import { getEstablishmentData } from '../../utils/utils'
import { ifWithinActiveAgency } from './activeAgencies'

type LinksData = {
  links: Link[]
}

export default class LinkService {
  async getHomepageLinks(user: LaunchpadUser, language: string): Promise<LinksData> {
    const {
      establishment: { agency_id: agencyId },
    } = user.idToken

    const establishment = getEstablishmentData(agencyId)
    const i18n = (i18nKey: string) => i18next.t(i18nKey, { lng: language })

    const links = [
      // Manage Apps Tile
      {
        image: '/assets/images/link-tile-images/manage-apps-link-tile-image.png',
        title: i18n('homepage.links.manageApps'),
        url: '/external/manage-apps',
        description: i18n('homepage.links.manageAppsDesc'),
        openInNewTab: true,
        show: await ifWithinActiveAgency(agencyId, process.env.MANAGE_APPS_UI_URL),
      },

      // UniLink / Self Service Tile
      {
        image: '/assets/images/link-tile-images/unilink-link-tile-image.jpg',
        title: i18n('homepage.links.selfService'),
        url: '/external/self-service',
        description: i18n('homepage.links.selfServiceDesc'),
        openInNewTab: true,
        show: true,
      },

      // Content Hub Legacy Tile ( version - to be removed)
      {
        image: '/assets/images/link-tile-images/content-hub-link-tile-image.jpg',
        title: i18n('homepage.links.contentHub'),
        url: '/external/content-hub-legacy',
        description: i18n('homepage.links.contentHubDesc'),
        openInNewTab: true,
        show: await ifWithinActiveAgency(agencyId, process.env.CONTENT_HUB_LEGACY_URL),
      },

      // Content Hub Tile (TypeScript refactor)
      {
        image: '/assets/images/link-tile-images/content-hub-link-tile-image.jpg',
        title: i18n('homepage.links.contentHub'),
        url: '/external/content-hub',
        description: i18n('homepage.links.contentHubDesc'),
        openInNewTab: true,
        show: await ifWithinActiveAgency(agencyId, process.env.CONTENT_HUB_URL),
      },

      // NPR - National Prison Radio Tile
      {
        image: '/assets/images/link-tile-images/npr-link-tile-image.jpg',
        title: i18n('homepage.links.nationalPrisonRadio'),
        url: '/external/prison-radio',
        description: i18n('homepage.links.nationalPrisonRadioDesc'),
        openInNewTab: true,
        show: true,
      },

      // Inside Time Tile
      {
        image: '/assets/images/link-tile-images/inside-time-link-tile-image.jpg',
        title: i18n('homepage.links.insideTime'),
        url: '/external/inside-time',
        description: i18n('homepage.links.insideTimeDesc'),
        openInNewTab: true,
        show: !establishment.hideInsideTime,
      },

      // Think Through Nurtition Tile
      {
        image: '/assets/images/link-tile-images/think-through-nutrition-link-tile-image.png',
        title: i18n('homepage.links.thinkThroughNutrition'),
        url: '/external/think-through-nutrition',
        description: i18n('homepage.links.thinkThroughNutritionDesc'),
        openInNewTab: true,
        show: !establishment.hideThinkThroughNutrition,
      },

      // PIN Phone Tile
      {
        image: '/assets/images/link-tile-images/pin-phone-tile-image.png',
        title: i18n('homepage.links.pinPhone'),
        url: '/external/pin-phone',
        description: i18n('homepage.links.pinPhoneDesc'),
        openInNewTab: true,
        show: await ifWithinActiveAgency(agencyId, process.env.PIN_PHONES_UI_URL),
      },
    ]

    return { links }
  }
}
