import type { Router } from 'express'
import express from 'express'
import passport from 'passport'
import flash from 'connect-flash'
import config from '../config'
import auth from '../authentication/launchpadAuth'

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

  // is this the point at which STEP 3 /v1/oauth2/authorize is called?
  router.get(
    '/sign-in',
    passport.authenticate('oauth2', {
      scope: [
        'user.establishment.read',
        'user.booking.read',
        'user.basic.read',
        'user.clients.read',
        'user.clients.delete',
      ],
    }),
  )

  router.get('/sign-in/callback', (req, res, next) =>
    passport.authenticate('oauth2', {
      successReturnToOrRedirect: req.session.returnTo || '/',
      failureRedirect: '/autherror',
    })(req, res, next),
  )

  const authUrl = config.apis.launchpadAuth.externalUrl
  const authSignOutUrl = `${authUrl}/sign-out?client_id=${config.apis.launchpadAuth.apiClientId}&redirect_uri=${config.domain}`

  router.use('/sign-out', (req, res, next) => {
    if (req.user) {
      req.logout(err => {
        if (err) return next(err)
        return req.session.destroy(() => res.redirect(authSignOutUrl))
      })
    } else res.redirect(authSignOutUrl)
  })

  router.use('/account-details', (req, res) => {
    res.redirect(`${authUrl}/account-details`)
  })

  router.use((req, res, next) => {
    res.locals.user = req.user
    // console.log('launchpad user:', res.locals.user)
    next()
  })

  return router
}
