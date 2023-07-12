import { RequestHandler } from 'express'

import type { Services } from '../../services'

export default class ProfileController {
  public constructor(private readonly services: Services) {}

  public view(): RequestHandler {
    return async (req, res) => {
      return res.render('pages/profile', {
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    }
  }
}
