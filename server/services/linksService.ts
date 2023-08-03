import { HmppsAuthClient } from '../data'
import { Link, LinksData } from '../@types/launchpad'

export default class Linkservice {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getLinks(): Promise<LinksData> {
    /* 
    TEMP TEST DATA
  */
    const links: Link[] = [
      {
        image: '/assets/images/link-tile-images/unilink-link-tile-image.png',
        title: 'Unilink',
        url: '#',
        description: 'Access to kiosk apps',
        openInNewTab: true,
      },
      {
        image: '/assets/images/link-tile-images/content-hub-link-tile-image.png',
        title: 'Content Hub',
        url: '#',
        description: 'Watch, read and listen to local and national content',
        openInNewTab: false,
      },
      {
        image: '/assets/images/link-tile-images/npr-link-tile-image.png',
        title: 'NPR',
        url: '#/tags/785',
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
    }
    /* 
    END - TEMP TEST DATA
  */

    return linksData
  }
}
