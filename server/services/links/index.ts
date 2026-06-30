import i18next from 'i18next'

import { Link } from '../../@types/launchpad'
import { getEstablishmentData } from '../../utils/utils'
import config from '../../config'
import { HmppsAuthClient, ManageAppsClient, RestClientBuilder } from '../../data'
import logger from '../../../logger'

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

    let manageAppsHidden: boolean
    try {
      const activeAgencies = await manageAppsApiClient.getActiveAgencies()
      manageAppsHidden = isManageAppsHidden(agencyId, user.idToken.sub, activeAgencies)
    } catch (error) {
      manageAppsHidden = true
      logger.error('Unable to establish manage apps active agencies', error)
    }

    const links = [
      {
        image: '/assets/images/link-tile-images/manage-apps-link-tile-image.png',
        title: i18next.t('homepage.links.manageApps', { lng: language }),
        url: '/external/manage-apps',
        description: i18next.t('homepage.links.manageAppsDesc', { lng: language }),
        openInNewTab: true,
        hidden: manageAppsHidden,
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

const isManageAppsHidden = (agencyId: string, prisonerId: string, activeEstablishments: string[]): boolean => {
  const allowedPrisoners = config.allowBetaAccessToPrisoners.split(',')
  return !(activeEstablishments.includes(agencyId) && allowedPrisoners.includes(prisonerId))
}
