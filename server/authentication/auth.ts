/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport'
import OpenIDConnectStrategy from 'passport-openidconnect'
import type { RequestHandler } from 'express'
import config from '../config'
import generateOauthClientToken from './clientCredentials'
import type { TokenVerifier } from '../data/tokenVerification'

// passport.serializeUser((user, cb) => {
//   process.nextTick(() => {
//     cb(null, user)
//   })
// })

// passport.deserializeUser((user, cb) => {
//   process.nextTick(() => {
//     return cb(null, user as Express.User)
//   })
// })

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
    return res.json({ test })
    // return res.redirect('/sign-in')
  }
}

function init(): void {
  passport.use(
    new OpenIDConnectStrategy(
      {
        issuer: `${config.apis.launchpadAuth.externalUrl}/v1/oauth2`,
        authorizationURL: `${config.apis.launchpadAuth.externalUrl}/v1/oauth2/authorize`,
        tokenURL: `${config.apis.launchpadAuth.url}/v1/oauth2/token`,
        userInfoURL: '',
        skipUserProfile: true,
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
      function verify(
        _iss: string,
        _profile: any,
        _context: any,
        idToken: string,
        accessToken: string,
        refreshToken: any,
        verified: any,
        done: (arg0: null, arg1: { idToken: any; refreshToken: any; accessToken: any; token: any }) => any,
      ) {
        // console.log('IN VERIFY')
        // console.log('IN VERIFY iss', iss)
        // console.log('IN VERIFY profile', profile)
        // console.log('IN VERIFY context', context)
        // console.log('IN VERIFY idToken', idToken)
        // console.log('IN VERIFY accessToken', accessToken)
        // console.log('IN VERIFY refreshToken', refreshToken)
        // console.log('IN VERIFY verified', verified)

        const user = {
          idToken: JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString()),
          refreshToken,
          accessToken,
          token: accessToken,
        }

        console.log('USER:', user)

        return done(null, user)
      },
    ),
  )
}

export default {
  authenticationMiddleware,
  init,
}
