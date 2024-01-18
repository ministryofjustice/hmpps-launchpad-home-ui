import type { Router, Request, Response, NextFunction } from 'express'
import express from 'express'
import passport from 'passport'
import flash from 'connect-flash'
import auth from '../authentication/auth'
import { checkTokenValidityAndUpdate } from '../utils/utils'
import logger from '../../logger'

const router = express.Router()

export default function setUpAuth(): Router {
  auth.init()

  router.use(passport.initialize())
  router.use(passport.session())
  router.use(flash())

  router.get('/autherror', (req, res) => {
    logger.info('authentication error')

    res.status(401)
    return res.render('autherror')
  })

  router.get('/sign-in', passport.authenticate('openidconnect'))

  router.get('/sign-in/callback', (req: Request, res: Response, next: NextFunction) => {
    logger.info('Auth: /sign-in/callback called')

    return passport.authenticate('openidconnect', {
      successReturnToOrRedirect: req.session.returnTo || '/',
      failureRedirect: '/autherror',
      failureMessage: true,
    })(req, res, next)
  })

  router.use(async (req, res, next) => {
    logger.info('Auth: checking token validity')
    await checkTokenValidityAndUpdate(req, res)

    logger.info('Auth: setting res.lo')
    res.locals.user = req.user

    next()
  })

  return router
}
