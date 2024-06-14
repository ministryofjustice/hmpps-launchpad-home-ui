import type { Request, Response, NextFunction } from 'express'
import superagent from 'superagent'
import { IdToken, RefreshToken, UpdatedTokensResponse } from '../@types/launchpad'
import logger from '../../logger'
import config from '../config'
import { generateBasicAuthHeader } from '../utils/utils'

export const createUserObject = (idToken: string, refreshToken: string, accessToken: string) => {
  return {
    idToken: JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString()),
    refreshToken,
    accessToken,
    token: accessToken,
  }
}

export const millisecondsPlusMinutesInSeconds = (now: number, minutes: number): number => {
  const oneSecondInMillis = 1000
  const minutesInMillis = minutes * 60 * oneSecondInMillis
  const nowEpochInSeconds = Math.floor((now + minutesInMillis) / oneSecondInMillis)

  return nowEpochInSeconds
}

export const tokenHasNotExpired = (token: IdToken | RefreshToken, nowEpochPlusMinutes: number): boolean => {
  logger.info(`Check if token has not expired given exp is ${token.exp} and current time is ${nowEpochPlusMinutes}`)
  return token.exp >= nowEpochPlusMinutes
}

export const getUpdatedToken = (refreshToken: string): Promise<UpdatedTokensResponse> => {
  const url = `${config.apis.launchpadAuth.externalUrl}/v1/oauth2/token`
  const grantType = 'refresh_token'
  const authHeaderValue = generateBasicAuthHeader(
    `${config.apis.launchpadAuth.apiClientId}`,
    `${config.apis.launchpadAuth.apiClientSecret}`,
  )

  const refreshedTokens: Promise<UpdatedTokensResponse> = new Promise((resolve, reject) => {
    superagent
      .post(url)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', authHeaderValue)
      .query({ refresh_token: refreshToken, grant_type: grantType })
      .end((err, res) => {
        if (err) {
          reject(err) // Reject the promise in case of an error
        } else {
          resolve(res.body) // Resolve the promise with the response body
        }
      })
  })

  return refreshedTokens
}

// also use this logic for try again button and access_token refresh (settings page)
export const checkTokenValidityAndUpdate = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next()
  }

  const { idToken, refreshToken } = req.user

  if (
    tokenHasNotExpired(
      idToken,
      millisecondsPlusMinutesInSeconds(Date.now(), config.apis.launchpadAuth.refreshCheckTimeInMinutes),
    )
  ) {
    // id_token is valid - continue
    return next()
  }

  const parsedRefreshToken = JSON.parse(Buffer.from(req.user.refreshToken.split('.')[1], 'base64').toString())

  // id_token is invalid and refresh_token is valid
  if (
    tokenHasNotExpired(
      parsedRefreshToken,
      millisecondsPlusMinutesInSeconds(Date.now(), config.apis.launchpadAuth.refreshCheckTimeInMinutes),
    )
  ) {
    try {
      const updatedTokensResponse: UpdatedTokensResponse = await getUpdatedToken(refreshToken)

      // updates req.user for the current request
      req.user = createUserObject(
        updatedTokensResponse.id_token,
        updatedTokensResponse.refresh_token,
        updatedTokensResponse.access_token,
      )

      // updates user object in the session for all future requests
      req.session.passport.user = req.user

      return next()
    } catch (error) {
      logger.error(`Token refresh error`)
      // Handle the error here
      return res.redirect('/autherror')
    }
  }

  // id_token is invalid and refresh_token is invalid
  // refresh / get id_token and refresh_token by redirecting to /sign-in - need to sign out first?
  return res.redirect('/sign-in')
}
