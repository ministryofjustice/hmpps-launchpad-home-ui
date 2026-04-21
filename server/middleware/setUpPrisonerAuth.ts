import passport from 'passport'
import flash from 'connect-flash'
import { Router } from 'express'
import { PrisonerAuth, minutes } from '@ministryofjustice/hmpps-prisoner-auth'
import config from '../config'
import { AUDIT_EVENTS, auditService } from '../services/audit/auditService'

passport.serializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user)
})

passport.deserializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user as Express.User)
})

const prisonerAuth = new PrisonerAuth({
  launchpadAuthUrl: config.apis.launchpadAuth.externalUrl,
  clientId: config.apis.launchpadAuth.apiClientId,
  clientSecret: config.apis.launchpadAuth.apiClientSecret,
  nonce: true,
  tokenMinimumLifespan: minutes(config.apis.launchpadAuth.refreshCheckTimeInMinutes),
  onLoginSuccessCallback: async user => {
    await auditService.audit({ what: AUDIT_EVENTS.LOGGED_IN, idToken: user.idToken })
  },
})

passport.use('prisoner-auth', prisonerAuth.passportStrategy())

export default function setUpPrisonerAuth() {
  const router = Router()

  router.use(passport.initialize())
  router.use(passport.session())
  router.use(flash())

  router.get('/autherror', (req, res) => {
    res.status(401)
    return res.render('autherror')
  })

  router.get('/sign-in', passport.authenticate('prisoner-auth'))

  router.get('/sign-in/callback', (req, res, next) =>
    passport.authenticate('prisoner-auth', {
      successReturnToOrRedirect: req.session.returnTo || '/',
      failureRedirect: '/autherror',
    })(req, res, next),
  )

  router.use('/sign-out', (req, res, next) => {
    if (req.user) {
      req.logout(err => {
        if (err) return next(err)
        return req.session.destroy(() => res.redirect('/'))
      })
    } else res.redirect('/')
  })

  router.use(async (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl
      return res.redirect('/sign-in')
    }

    return prisonerAuth
      .validateAndRefreshUser(req.user)
      .then(user => {
        req.user = user
        next()
      })
      .catch(() => res.redirect('/autherror'))
  })

  router.use((req, res, next) => {
    res.locals.user = req.user
    next()
  })

  return router
}
