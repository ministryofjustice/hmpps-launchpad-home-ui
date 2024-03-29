/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport'
import OpenIDConnectStrategy from 'passport-openidconnect'
import type { RequestHandler } from 'express'
import config from '../config'
import generateOauthClientToken from './clientCredentials'
import type { TokenVerifier } from '../data/tokenVerification'
import { createUserObject } from './refreshToken'

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
        callbackURL: `${config.domain}/sign-in/callback`,
        scope: scopes,
        nonce: 'true',
        customHeaders: { Authorization: generateOauthClientToken() },
      },
      function verify(
        _iss: string,
        _profile: any,
        _context: any,
        idToken: string,
        accessToken: string,
        refreshToken: any,
        _verified: any,
        cb: (arg0: null, arg1: { idToken: any; refreshToken: any; accessToken: any; token: any }) => any,
      ) {
        return cb(null, createUserObject(idToken, refreshToken, accessToken))
      },
    ),
  )
}

export default {
  authenticationMiddleware,
  init,
}
