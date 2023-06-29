import { RequestHandler } from 'express'

import type { Services } from '../../services'
import { formatDate } from '../../utils/utils'

export default class PrisonStatusController {
  public constructor(private readonly services: Services) {}

  private testEventsData = {
    isTomorrow: false,
    error: false,
    events: [
      {
        timeString: '8:30am to 11:45am',
        description: 'Event description',
        location: 'Event location',
      },
      {
        timeString: '1:45pm to 4:45pm',
        description: 'Event description',
        location: 'Event location',
      },
      {
        timeString: '6:30pm to 7:45pm',
        description: 'Event description',
        location: 'Event location',
      },
    ],
  }

  private testLinksData = {
    title: '',
    links: [
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
        description: 'Watch, readand listen to local and national content',
        openInNewTab: false,
      },
      {
        image: '/assets/images/link-tile-images/npr-link-tile-image.png',
        title: 'NPR',
        url: '#',
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
    ],
  }

  public view(): RequestHandler {
    return async (req, res) => {
      return res.render('pages/homepage', {
        errors: req.flash('errors'),
        message: req.flash('message'),
        today: formatDate(new Date()),
        eventsData: this.testEventsData,
        linksData: this.testLinksData,
      })
    }
  }
}
