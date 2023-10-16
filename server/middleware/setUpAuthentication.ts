import type { Router, Request, Response, NextFunction } from 'express'
import express from 'express'
import passport from 'passport'
import flash from 'connect-flash'
import auth from '../authentication/auth'
import { checkTokenValidityAndUpdate } from '../utils/utils'

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
    console.log('req.user 1: req.user.idToken.exp:', req?.user?.idToken?.exp) // is old user - old user gets passed into checkTokenValidityAndUpdate() - why?

    // const refreshTokens = await checkTokenValidityAndUpdate(req, res, next)
    // req.user = refreshTokens

    await checkTokenValidityAndUpdate(req, res, next)

    console.log('req.user 2: req.user.idToken.exp:', req?.user?.idToken?.exp) // req.user has been updated iwth the new user

    res.locals.user = req.user
  })

  return router
}
