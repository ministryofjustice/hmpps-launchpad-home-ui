/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport'
import OpenIDConnectStrategy from 'passport-openidconnect'
import type { RequestHandler } from 'express'
import config from '../config'
import generateOauthClientToken from './clientCredentials'
import type { TokenVerifier } from '../data/tokenVerification'
import { createUserObject } from './refreshToken'
import { AUDIT_EVENTS, auditService } from '../services/audit/auditService'
import logger from '../../logger'

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, user)
  })
})

passport.deserializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, user as Express.User)
  })
})

export type AuthenticationMiddleware = (tokenVerifier: TokenVerifier) => RequestHandler

const authenticationMiddleware: AuthenticationMiddleware = verifyToken => {
  return async (req, res, next) => {
    if (req.isAuthenticated() && (await verifyToken(req))) {
      return next()
    }

    req.session.returnTo = req.originalUrl

    return res.redirect('/sign-in')
  }
}

function init(): void {
  const scopes: string[] = config.apis.launchpadAuth.scopes.map(scope => scope.type)
  const callbackURL = `${config.domain}/sign-in/callback`

  logger.info(`🔧 OAuth2 Configuration:`)
  logger.info(`🔧 Callback URL: ${callbackURL}`)
  logger.info(`🔧 Authorization URL: ${config.apis.launchpadAuth.externalUrl}/v1/oauth2/authorize`)
  logger.info(`🔧 Token URL: ${config.apis.launchpadAuth.url}/v1/oauth2/token`)
  logger.info(`🔧 Scopes: ${scopes.join(', ')}`)

  passport.use(
    new OpenIDConnectStrategy(
      {
        issuer: `${config.apis.launchpadAuth.externalUrl}`,
        authorizationURL: `${config.apis.launchpadAuth.externalUrl}/v1/oauth2/authorize`,
        tokenURL: `${config.apis.launchpadAuth.url}/v1/oauth2/token`,
        userInfoURL: '',
        skipUserProfile: true,
        clientID: config.apis.launchpadAuth.apiClientId,
        clientSecret: config.apis.launchpadAuth.apiClientSecret,
        callbackURL,
        scope: scopes,
        nonce: 'true',
        customHeaders: { Authorization: generateOauthClientToken() },
      },
      async function verify(
        _iss: string,
        _profile: any,
        _context: any,
        idToken: string,
        accessToken: string,
        refreshToken: any,
        _verified: any,
        cb: (arg0: null, arg1: { idToken: any; refreshToken: any; accessToken: any; token: any }) => any,
      ) {
        logger.info(`✅ OAuth2 Token Exchange Successful`)
        logger.info(`✅ Issuer: ${_iss}`)
        logger.info(`✅ Access Token received: ${accessToken ? 'Yes' : 'No'}`)
        logger.info(`✅ Refresh Token received: ${refreshToken ? 'Yes' : 'No'}`)
        logger.info(`✅ ID Token received: ${idToken ? 'Yes' : 'No'}`)

        const user = createUserObject(idToken, refreshToken, accessToken)
        await auditService.audit({ what: AUDIT_EVENTS.LOGGED_IN, idToken: user.idToken })

        logger.info(`✅ User object created with idToken containing user data`)
        return cb(null, user)
      },
    ),
  )
}

export default {
  authenticationMiddleware,
  init,
}
