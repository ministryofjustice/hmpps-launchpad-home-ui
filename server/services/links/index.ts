import i18next from 'i18next'
import { LaunchpadUser } from '@ministryofjustice/hmpps-prisoner-auth'
import { Link } from '../../@types/launchpad'
import { getEstablishmentData } from '../../utils/utils'
import config from '../../config'
import { ifWithinActiveAgency } from './activeAgencies'

export type LinksData = {
  links: Link[]
  title?: string
}

export default class LinkService {
  async getHomepageLinks(user: LaunchpadUser, language: string): Promise<LinksData> {
    const {
      establishment: { agency_id: agencyId },
      sub: prisonerId,
    } = user.idToken

    const manageAppsVisible =
      (await ifWithinActiveAgency(agencyId, process.env.MANAGE_APPS_UI_URL)) &&
      config.allowBetaAccessToPrisoners.split(',').includes(prisonerId)

    const pinPhonesVisible = await ifWithinActiveAgency(agencyId, process.env.PIN_PHONES_UI_URL)

    const links = [
      {
        image: '/assets/images/link-tile-images/manage-apps-link-tile-image.png',
        title: i18next.t('homepage.links.manageApps', { lng: language }),
        url: '/external/manage-apps',
        description: i18next.t('homepage.links.manageAppsDesc', { lng: language }),
        openInNewTab: true,
        show: manageAppsVisible,
      },
      {
        image: '/assets/images/link-tile-images/unilink-link-tile-image.jpg',
        title: i18next.t('homepage.links.selfService', { lng: language }),
        url: '/external/self-service',
        description: i18next.t('homepage.links.selfServiceDesc', { lng: language }),
        openInNewTab: true,
        show: true,
      },
      {
        image: '/assets/images/link-tile-images/content-hub-link-tile-image.jpg',
        title: i18next.t('homepage.links.contentHub', { lng: language }),
        url: '/external/content-hub',
        description: i18next.t('homepage.links.contentHubDesc', { lng: language }),
        openInNewTab: true,
        show: true,
      },
      {
        image: '/assets/images/link-tile-images/npr-link-tile-image.jpg',
        title: i18next.t('homepage.links.nationalPrisonRadio', { lng: language }),
        url: '/external/prison-radio',
        description: i18next.t('homepage.links.nationalPrisonRadioDesc', { lng: language }),
        openInNewTab: true,
        show: true,
      },
      {
        image: '/assets/images/link-tile-images/inside-time-link-tile-image.jpg',
        title: i18next.t('homepage.links.insideTime', { lng: language }),
        url: '/external/inside-time',
        description: i18next.t('homepage.links.insideTimeDesc', { lng: language }),
        openInNewTab: true,
        show: !getEstablishmentData(agencyId).hideInsideTime,
      },
      {
        image: '/assets/images/link-tile-images/think-through-nutrition-link-tile-image.png',
        title: i18next.t('homepage.links.thinkThroughNutrition', { lng: language }),
        url: '/external/think-through-nutrition',
        description: i18next.t('homepage.links.thinkThroughNutritionDesc', { lng: language }),
        openInNewTab: true,
        show: !getEstablishmentData(agencyId).hideThinkThroughNutrition,
      },
      {
        image: '/assets/images/link-tile-images/pin-phone-tile-image.png',
        title: i18next.t('homepage.links.pinPhone', { lng: language }),
        url: '/external/pin-phone',
        description: i18next.t('homepage.links.pinPhoneDesc', { lng: language }),
        openInNewTab: true,
        show: pinPhonesVisible,
      },
    ]

    return { links }
  }
}
