import jwt from 'jsonwebtoken'
import { Response } from 'superagent'

import { stubFor, getMatchingRequests } from './wiremock'
import tokenVerification from './tokenVerification'

const createToken = () => {
  const payload = {
    user_name: 'USER1',
    scope: ['read'],
    auth_source: 'nomis',
    authorities: [],
    jti: '83b50a10-cca6-41db-985f-e87efb303ddb',
    client_id: 'clientid',
  }

  return jwt.sign(payload, 'secret', { expiresIn: '1h' })
}

const getSignInUrl = (): Promise<string> =>
  getMatchingRequests({
    method: 'GET',
    urlPath: '/auth/oauth2/authorize',
  }).then(data => {
    const { requests } = data.body
    const stateValue = requests[requests.length - 1].queryParams.state.values[0]
    return `/sign-in/callback?code=codexxxx&state=${stateValue}`
  })

const favicon = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/favicon.ico',
    },
    response: {
      status: 200,
    },
  })

const ping = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/health/ping',
    },
    response: {
      status: 200,
    },
  })

const redirect = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/oauth/authorize\\?response_type=code&redirect_uri=.+?&state=.+?&client_id=clientid',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        Location: 'http://localhost:3007/sign-in/callback?code=codexxxx&state=stateyyyy',
      },
      body: '<html><body>SignIn page<h1>Sign in</h1></body></html>',
    },
  })

const signOut = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/sign-out.*',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: '<html><body>SignIn page<h1>Sign in</h1></body></html>',
    },
  })

const manageDetails = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/account-details.*',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: '<html><body><h1>Your account details</h1></body></html>',
    },
  })

const token = () => {
  const generatedToken = createToken()
  // eslint-disable-next-line no-console
  console.log('[Mock Auth] Generated token:', generatedToken)

  return stubFor({
    request: {
      method: 'POST',
      urlPattern: '/auth/oauth/token',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Location: 'http://localhost:3007/sign-in/callback?code=codexxxx&state=stateyyyy',
      },
      jsonBody: {
        access_token: generatedToken,
        token_type: 'bearer',
        user_name: 'USER1',
        expires_in: 599,
        scope: 'read',
        internalUser: true,
      },
    },
  })
}

const stubUser = (name: string) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/api/user/me',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        staffId: 231232,
        username: 'USER1',
        active: true,
        name,
      },
    },
  })

const stubUserRoles = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/api/user/me/roles',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: [{ roleCode: 'SOME_USER_ROLE' }],
    },
  })

// Mimic /v1/oauth2/authorize callback
const stubOauth2AuthorizeCallback = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/v1/oauth2/authorize\\?.*',
    },
    response: {
      status: 302,
      headers: {
        Location: 'http://localhost:3000/sign-in/callback?code=mock-auth-code&state={{request.query.state}}',
      },
      transformers: ['response-template'],
    },
  })

const stubOauth2Token = () => {
  // Create a proper JWT token structure for OAuth2
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    sub: 'G3682UE',
    name: 'Test User',
    given_name: 'Test',
    family_name: 'User',
    email: 'test.user@example.com',
    preferred_username: 'G3682UE',
    establishment_id: 'MDI',
    establishment_name: 'HMP Moorland',
    booking_id: '123456',
    prisoner_number: 'A1234BC',
    iat: now,
    exp: now + 3600,
    iss: 'http://localhost:9091',
    aud: 'launchpad-home-ui',
  }

  const refreshPayload = {
    ...payload,
    type: 'refresh',
    exp: now + 604800, // 7 days
  }

  const accessToken = jwt.sign(payload, 'secret')
  const refreshToken = jwt.sign(refreshPayload, 'secret')

  return stubFor({
    request: {
      method: 'POST',
      urlPattern: '/v1/oauth2/token',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      jsonBody: {
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: refreshToken,
        id_token: accessToken,
        scope: 'openid user.basic.read user.establishment.read user.booking.read',
      },
    },
  })
}

export default {
  getSignInUrl,
  stubAuthPing: ping,
  stubSignIn: (): Promise<[Response, Response, Response, Response, Response, Response]> =>
    Promise.all([favicon(), redirect(), signOut(), manageDetails(), token(), tokenVerification.stubVerifyToken()]),
  stubAuthUser: (name = 'john smith'): Promise<[Response, Response]> => Promise.all([stubUser(name), stubUserRoles()]),
  stubOauth2AuthorizeCallback,
  stubOauth2Token,
}
