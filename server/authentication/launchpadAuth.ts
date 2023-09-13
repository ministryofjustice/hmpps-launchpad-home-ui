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
    return res.redirect('/sign-in')
  }
}

// need to overide this to add nonce value - https://stackoverflow.com/questions/32357879/module-passport-oauth2-in-nodej-js-extra-parameters-to-be-included-in-the-autho
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
      return done(null, { token, username: params.user_name, authSource: params.auth_source })
    },
  )

  // strategy.authorizationParams = () => {
  //   return {
  //     scope: 'user.establishment.read user.booking.read user.basic.read user.clients.read user.clients.delete',
  //   }
  // }

  passport.use(strategy)
}

export default {
  authenticationMiddleware,
  init,
}
