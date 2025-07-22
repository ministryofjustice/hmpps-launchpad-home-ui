import i18next from 'i18next'

import { Link } from '../../@types/launchpad'
import { getEstablishmentData } from '../../utils/utils'

export type LinksData = {
  links: Link[]
  title?: string
}

export default class Linkservice {
  constructor() {}

  async getHomepageLinks(
    user: { idToken: { establishment: { agency_id: string } } },
    language: string,
  ): Promise<LinksData> {
    const { hideInsideTime } = getEstablishmentData(user.idToken.establishment.agency_id)

    const links = [
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
    ]
    return { links }
  }
}
