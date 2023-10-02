import passport from 'passport'
import OpenIDConnectStrategy from 'passport-openidconnect'
import type { RequestHandler } from 'express'
import config from '../config'
import generateOauthClientToken from './clientCredentials'
import type { TokenVerifier } from '../data/tokenVerification'

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

// passport.serializeUser((user, done) => {
//   // Not used but required for Passport
//   done(null, user)
// })

// passport.deserializeUser((user, done) => {
//   // Not used but required for Passport
//   done(null, user as Express.User)
// })

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
  passport.use(
    new OpenIDConnectStrategy(
      {
        issuer: `${config.apis.launchpadAuth.externalUrl}`,
        authorizationURL: `${config.apis.launchpadAuth.externalUrl}/v1/oauth2/authorize`,
        tokenURL: `${config.apis.launchpadAuth.url}/v1/oauth2/token`,
        userInfoURL: `${config.apis.launchpadAuth.externalUrl}`,
        clientID: config.apis.launchpadAuth.apiClientId,
        clientSecret: config.apis.launchpadAuth.apiClientSecret,
        callbackURL: `${config.domain}/sign-in/callback`,
        scope: [
          'user.establishment.read',
          'user.booking.read',
          'user.basic.read',
          'user.clients.read',
          'user.clients.delete',
        ],
        nonce: 'true',
        customHeaders: { Authorization: generateOauthClientToken() },
      },
      function verify(_issuer: unknown, profile: unknown, cb: (arg0: null, arg1: unknown) => unknown) {
        return cb(null, profile)
      },
    ),
  )

  // (issuer: any, profile: any, cb: any) => {
  //   console.log('profile', profile)
  //   const user = {
  //     idToken: JSON.parse(Buffer.from(profile.id_token.split('.')[1], 'base64').toString()),
  //     refreshToken: profile.refreshToken,
  //     accessToken: profile.access_token,
  //     token: profile.access_token,
  //   }

  //   return cb(null, user)
  // },
}

export default {
  authenticationMiddleware,
  init,
}
