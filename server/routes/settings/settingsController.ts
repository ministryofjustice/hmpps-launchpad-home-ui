import { RequestHandler } from 'express'

import type { Services } from '../../services'

export default class SettingsController {
  public constructor(private readonly services: Services) {}

  private testData = [
    {
      details: {
        image: '/assets/images/logo-think-through-nutrition-104x78.png',
        name: 'Think Through Nutrition',
      },
      sharing: ['Your name', 'Your booking information', 'Your establishment information'],
      sharedOn: '10 July 2023',
      status: 'You share data with Content Hub so it can be displayed on your tablets. You cannot remove access',
    },
    {
      details: {
        image: '/assets/images/logo-content-hub-104x78.png',
        name: 'Content Hub',
      },
      sharing: [
        'Your name',
        'Details of your prison',
        'Prison booking details (tbc)',
        'Apps you allow access to',
        'Apps you remove access to',
      ],
      sharedOn: '10 July 2023',
      status: '',
    },
    {
      details: {
        image: '/assets/images/logo-launchpad-104x78.png',
        name: 'Launchpad',
      },
      sharing: [
        'Your name',
        'Details of your prison',
        'Prison booking details (tbc)',
        'Apps you allow access to',
        'Apps you remove access to',
      ],
      sharedOn: '17 July 2023',
      status: '',
    },
  ]

  public view(): RequestHandler {
    return async (req, res) => {
      return res.render('pages/settings', {
        errors: req.flash('errors'),
        message: req.flash('message'),
        data: this.testData,
      })
    }
  }
}
