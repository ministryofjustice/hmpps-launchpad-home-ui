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

    // if refresh token !expired - refresh token here not redirect to /sign-in

    // ...

    // if refresh token has expired redirect to /sign-in
    // check if refresh token is updated in redis

    return res.redirect('/sign-in')
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
      const user = {
        idToken: JSON.parse(Buffer.from(params.id_token.split('.')[1], 'base64').toString()),
        refreshToken,
        accessToken: params.access_token,
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
