import type { Router, Request, Response, NextFunction } from 'express'
import express from 'express'
import passport from 'passport'
import flash from 'connect-flash'
import config from '../config'
import auth from '../authentication/auth'

const router = express.Router()

export default function setUpAuth(): Router {
  auth.init()

  router.use(passport.initialize())
  router.use(passport.session())
  router.use(flash())

  router.get('/autherror', (req, res) => {
    console.log('AUTH FAILURE:')
    // console.log('REQ', req)
    res.status(401)
    return res.render('autherror')
  })

  router.get('/sign-in', passport.authenticate('openidconnect'))

  // START HERE >>>>>SUCCESSFULLY GETTING TOKENS FORM AUTH - INTERMITDENT SAVING TO REDIS - 401 ERROR AND REDIRECTING TO /sign-out
  router.get('/sign-in/callback', (req, res, next) => {
    return passport.authenticate('openidconnect', {
      successReturnToOrRedirect: req.session.returnTo || '/',
      failureRedirect: '/autherror',
      failureMessage: true,
    })(req, res, next)
  })

  const authUrl = config.apis.launchpadAuth.externalUrl
  const authSignOutUrl = `${authUrl}/sign-out?client_id=${config.apis.launchpadAuth.apiClientId}&redirect_uri=${config.domain}`

  // whats triggering the call to /sign-out
  router.use('/sign-out', (req: Request, res: Response, next: NextFunction) => {
    console.log('IN SIGNOUT')
    console.log('req user:', req.user)
    if (req.user) {
      req.logout(err => {
        if (err) return next(err)
        return req.session.destroy(() => res.redirect(authSignOutUrl))
      })
    } else res.redirect(authSignOutUrl)
  })

  router.use((req, res, next) => {
    res.locals.user = req.user
    console.log('RES LOCALS USER', res.locals.user)
    next()
  })

  return router
}
