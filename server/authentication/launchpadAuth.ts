import passport from 'passport'
import { Strategy } from 'passport-oauth2'
import type { RequestHandler } from 'express'

import config from '../config'
import generateOauthClientToken from './clientCredentials'
import type { TokenVerifier } from '../data/tokenVerification'

passport.serializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user)
})

passport.deserializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user as Express.User)
})

export type AuthenticationMiddleware = (tokenVerifier: TokenVerifier) => RequestHandler

const authenticationMiddleware: AuthenticationMiddleware = verifyToken => {
  return async (req, res, next) => {
    if (req.isAuthenticated() && (await verifyToken(req))) {
      return next()
    }
    req.session.returnTo = req.originalUrl
    return res.redirect('/sign-in') // this is not causing the auth loop
  }
}

function init(): void {
  const strategy = new Strategy(
    {
      authorizationURL: `${config.apis.launchpadAuth.externalUrl}/v1/oauth2/authorize`,
      tokenURL: `${config.apis.launchpadAuth.url}/v1/oauth2/token`,
      clientID: config.apis.launchpadAuth.apiClientId,
      clientSecret: config.apis.launchpadAuth.apiClientSecret,
      callbackURL: `${config.domain}/sign-in/callback`,
      state: true,
      customHeaders: { Authorization: generateOauthClientToken() },
    },
    (token, refreshToken, params, profile, done) => {
      // UPDATED server > @types > express > index.d.ts > User interface

      // TO DO - decode id_token

      // TO DO - change Express.User (server > @types > express > index.d.ts > User interface) object interface to match user object

      // TO DO - pass that through in addition to tokens

      const user = {
        refreshToken: JSON.parse(Buffer.from(refreshToken.split('.')[1], 'base64').toString()),
        idToken: JSON.parse(Buffer.from(params.id_token.split('.')[1], 'base64').toString()),
        accessToken: JSON.parse(Buffer.from(params.access_token.split('.')[1], 'base64').toString()),
        tokenType: params.token_type,
        expiresIn: params.expires_in,
        token,
      }

      return done(null, user)
    },
  )

  passport.use(strategy)
}

export default {
  authenticationMiddleware,
  init,
}
