import { Link, LinksData } from '../@types/launchpad'
import { getEstablishmentLinksData } from '../utils/utils'

export default class Linkservice {
  constructor() {}

  async getHomepageLinks(user: { idToken: { establishment: { agency_id: string } } }): Promise<LinksData> {
    const { prisonerContentHubURL, selfServiceURL } = getEstablishmentLinksData(user.idToken.establishment.agency_id)

    const links: Link[] = [
      {
        image: '/assets/images/link-tile-images/unilink-link-tile-image.png',
        title: 'Self-service',
        url: selfServiceURL,
        description: 'Access to kiosk apps',
        openInNewTab: true,
      },
      {
        image: '/assets/images/link-tile-images/content-hub-link-tile-image.png',
        title: 'Content Hub',
        url: prisonerContentHubURL,
        description: 'Watch, read and listen to local and national content',
        openInNewTab: true,
      },
      {
        image: '/assets/images/link-tile-images/npr-link-tile-image.png',
        title: 'NPR',
        url: `${prisonerContentHubURL}/tags/785`,
        description: 'Listen to 24/7 music, talk, requests and playbacks',
        openInNewTab: true,
      },
      {
        image: '/assets/images/link-tile-images/inside-time-link-tile-image.png',
        title: 'Inside Time',
        url: 'https://insidetimeprison.org/',
        description: 'Read the national newspaper for prisoners and detainees',
        openInNewTab: true,
      },
    ]

    const linksData: LinksData = {
      links,
      prisonerContentHubURL,
    }

    return linksData
  }
}
