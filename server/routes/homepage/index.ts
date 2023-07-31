import { type RequestHandler, Router } from 'express'
import { PrisonerEvent, EventsData, Link, LinksData } from '../../@types/launchpad'

import asyncMiddleware from '../../middleware/asyncMiddleware'

import type { Services } from '../../services'
import { formatDate } from '../../utils/utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  /* 
    TEMP TEST DATA
  */
  const events: PrisonerEvent[] = [
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
  ]

  const eventsData: EventsData = {
    isTomorrow: false,
    error: false,
    events,
  }

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
    title: '',
    links,
  }
  /* 
    END - TEMP TEST DATA
  */

  get('/', (req, res) => {
    return res.render('pages/homepage', {
      errors: req.flash('errors'),
      message: req.flash('message'),
      today: formatDate(new Date()),
      eventsData,
      linksData,
    })
  })

  return router
}
