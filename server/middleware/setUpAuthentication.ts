import type { Router, Request, Response, NextFunction } from 'express'
import express from 'express'
import passport from 'passport'
import flash from 'connect-flash'
import auth from '../authentication/auth'
import { checkTokenValidityAndUpdate, nowMinus5Minutes, tokenIsValid } from '../authentication/refreshToken'

const router = express.Router()

export default function setUpAuth(): Router {
  auth.init()

  router.use(passport.initialize())
  router.use(passport.session())
  router.use(flash())

  router.get('/autherror', (req, res) => {
    res.status(401)
    return res.render('autherror')
  })

  router.get('/sign-in', passport.authenticate('openidconnect'))

  router.get('/sign-in/callback', (req: Request, res: Response, next: NextFunction) => {
    return passport.authenticate('openidconnect', {
      successReturnToOrRedirect: req.session.returnTo || '/',
      failureRedirect: '/autherror',
      failureMessage: true,
    })(req, res, next)
  })

  router.use(async (req, res, next) => {
    await checkTokenValidityAndUpdate(req, res, next)

    if (req.user) {
      const parsedRefreshToken = JSON.parse(Buffer.from(req.user.refreshToken?.split('.')[1], 'base64').toString())

      if (tokenIsValid(parsedRefreshToken, nowMinus5Minutes(Date.now()))) {
        req.session.cookie.expires = new Date(parsedRefreshToken.exp * 1000)
      }
    }

    res.locals.user = req.user
  })

  return router
}
