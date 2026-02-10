import flash from 'connect-flash'
import type { NextFunction, Request, Response, Router } from 'express'
import express from 'express'
import passport from 'passport'
import logger from '../../logger'
import auth from '../authentication/auth'
import { checkTokenValidityAndUpdate } from '../authentication/refreshToken'
import { AUDIT_EVENTS, auditService } from '../services/audit/auditService'

const router = express.Router()

export default function setUpAuth(): Router {
  auth.init()

  router.use(passport.initialize())
  router.use(passport.session())
  router.use(flash())

  // Log any requests that might be OAuth2-related callbacks
  router.use((req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl.toLowerCase()
    if (url.includes('callback') || url.includes('oauth') || url.includes('auth')) {
      logger.info(`🔍 OAuth2-related request detected: ${req.method} ${req.originalUrl}`)
      logger.info(`🔍 Request headers:`, {
        'user-agent': req.get('User-Agent'),
        referer: req.get('Referer'),
        authorization: req.get('Authorization') ? '[PRESENT]' : '[NOT PRESENT]',
      })
      if (Object.keys(req.query).length > 0) {
        logger.info(`🔍 Query parameters:`, req.query)
      }
    }
    next()
  })

  router.get('/autherror', async (req, res) => {
    res.status(401)
    await auditService.audit({
      what: AUDIT_EVENTS.AUTHENTICATION_FAILURE,
      details: { url: req.originalUrl, query: req.query },
    })
    return res.render('autherror')
  })

  router.get('/sign-in', (req: Request, res: Response, next: NextFunction) => {
    logger.info(`🔐 OAuth2 Sign-in initiated from: ${req.originalUrl}`)
    logger.info(`🔐 User-Agent: ${req.get('User-Agent')}`)
    return passport.authenticate('openidconnect')(req, res, next)
  })

  router.get('/sign-in/callback', (req: Request, res: Response, next: NextFunction) => {
    logger.info(`🔄 OAuth2 Callback received: ${req.originalUrl}`)
    logger.info(`🔄 Callback query params:`, req.query)
    logger.info(`🔄 Callback headers:`, {
      'user-agent': req.get('User-Agent'),
      referer: req.get('Referer'),
      'x-forwarded-for': req.get('X-Forwarded-For'),
    })

    return passport.authenticate('openidconnect', {
      successReturnToOrRedirect: req.session.returnTo || '/',
      failureRedirect: '/autherror',
      failureMessage: true,
    })(req, res, next)
  })

  router.use(async (req, res, next) => {
    await checkTokenValidityAndUpdate(req, res, next)

    if (req.user) {
      try {
        logger.debug(`Current cookie expiry is ${new Date(req.session.cookie.expires)}`)
        const parsedRefreshToken = JSON.parse(Buffer.from(req.user.refreshToken?.split('.')[1], 'base64').toString())
        const oneSecondInMillis = 1000
        const refreshTokenExpInMillis = parsedRefreshToken.exp * oneSecondInMillis

        req.session.cookie.maxAge = refreshTokenExpInMillis - Date.now()
        logger.debug(`Updated cookie expiry to ${new Date(req.session.cookie.expires)}`)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        logger.error('Failed to parse refresh token')
      }
    }

    res.locals.user = req.user
  })

  return router
}
