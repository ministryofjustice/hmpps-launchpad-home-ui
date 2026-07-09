import i18next from 'i18next'

import { Link } from '../../@types/launchpad'
import { getEstablishmentData } from '../../utils/utils'
import config from '../../config'
import { HmppsAuthClient, ManageAppsClient, RestClientBuilder } from '../../data'

export type LinksData = {
  links: Link[]
  title?: string
}

export default class Linkservice {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly manageAppsApiClientFactory: RestClientBuilder<ManageAppsClient>,
  ) {}

  async getHomepageLinks(
    user: { idToken: { establishment: { agency_id: string }; sub: string } },
    language: string,
  ): Promise<LinksData> {
    const { agencyId, hideInsideTime, hideThinkThroughNutrition } = getEstablishmentData(
      user.idToken.establishment.agency_id,
    )

    const token = await this.hmppsAuthClient.getSystemClientToken()

    const manageAppsApiClient = this.manageAppsApiClientFactory(token)
    const manageAppsActiveAgencies = await manageAppsApiClient.getActiveAgencies()
    const manageAppsVisible =
      isAgencyActive(agencyId, manageAppsActiveAgencies) && isUserBetaAccessPrisoner(user.idToken.sub)

    const links = [
      {
        image: '/assets/images/link-tile-images/manage-apps-link-tile-image.png',
        title: i18next.t('homepage.links.manageApps', { lng: language }),
        url: '/external/manage-apps',
        description: i18next.t('homepage.links.manageAppsDesc', { lng: language }),
        openInNewTab: true,
        hidden: !manageAppsVisible,
      },
      {
        image: '/assets/images/link-tile-images/unilink-link-tile-image.jpg',
        title: i18next.t('homepage.links.selfService', { lng: language }),
        url: '/external/self-service',
        description: i18next.t('homepage.links.selfServiceDesc', { lng: language }),
        openInNewTab: true,
        hidden: false,
      },
      {
        image: '/assets/images/link-tile-images/content-hub-link-tile-image.jpg',
        title: i18next.t('homepage.links.contentHub', { lng: language }),
        url: '/external/content-hub',
        description: i18next.t('homepage.links.contentHubDesc', { lng: language }),
        openInNewTab: true,
        hidden: false,
      },
      {
        image: '/assets/images/link-tile-images/npr-link-tile-image.jpg',
        title: i18next.t('homepage.links.nationalPrisonRadio', { lng: language }),
        url: '/external/prison-radio',
        description: i18next.t('homepage.links.nationalPrisonRadioDesc', { lng: language }),
        openInNewTab: true,
        hidden: false,
      },
      {
        image: '/assets/images/link-tile-images/inside-time-link-tile-image.jpg',
        title: i18next.t('homepage.links.insideTime', { lng: language }),
        url: '/external/inside-time',
        description: i18next.t('homepage.links.insideTimeDesc', { lng: language }),
        openInNewTab: true,
        hidden: hideInsideTime || false,
      },
      {
        image: '/assets/images/link-tile-images/think-through-nutrition-link-tile-image.png',
        title: i18next.t('homepage.links.thinkThroughNutrition', { lng: language }),
        url: '/external/think-through-nutrition',
        description: i18next.t('homepage.links.thinkThroughNutritionDesc', { lng: language }),
        openInNewTab: true,
        hidden: hideThinkThroughNutrition || false,
      },
    ]
    return { links }
  }
}

export const isAgencyActive = (agencyId: string, activeAgencies: string[]): boolean => {
  return activeAgencies.includes(agencyId) || activeAgencies[0] === '***'
}

// NOTE: intended only for Manage Apps on a temporary basis
const isUserBetaAccessPrisoner = (prisonerId: string): boolean => {
  const betaAccessPrisoner = config.allowBetaAccessToPrisoners.split(',')
  return betaAccessPrisoner.includes(prisonerId)
}
