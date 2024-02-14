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

export const millisecondsMinusMinutesInSeconds = (now: number, minutes: number): number => {
  const oneSecondInMillis = 1000
  const minutesInMillis = minutes * 60 * oneSecondInMillis
  const nowEpochInSeconds = Math.floor((now - minutesInMillis) / oneSecondInMillis)

  return nowEpochInSeconds
}

export const tokenHasNotExpired = (token: IdToken | RefreshToken, nowEpochMinusMinutes: number): boolean => {
  logger.debug(
    `tokenHasNotExpired(${new Date(token.exp * 1000)}, ${new Date(nowEpochMinusMinutes * 1000)}) => ${
      nowEpochMinusMinutes <= token.exp
    }`,
  )

  return nowEpochMinusMinutes <= token.exp
}

export const updateToken = (refreshToken: string): Promise<UpdatedTokensResponse> => {
  const url = `${config.apis.launchpadAuth.externalUrl}/v1/oauth2/token`
  logger.debug(`updateToken calling ${url}`)
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
  logger.debug('checkTokenValidityAndUpdate')
  if (!req.user) {
    logger.debug('No user')
    return next()
  }

  const { idToken, refreshToken } = req.user

  const pat = JSON.parse(Buffer.from(req.user.accessToken.split('.')[1], 'base64').toString())
  const prt = JSON.parse(Buffer.from(req.user.refreshToken.split('.')[1], 'base64').toString())
  console.log(new Date())
  console.log(new Date(idToken.exp * 1000))
  console.log(new Date(pat.exp * 1000))
  console.log(new Date(prt.exp * 1000))

  logger.debug('Check idToken')
  if (
    tokenHasNotExpired(
      idToken,
      millisecondsMinusMinutesInSeconds(Date.now(), config.apis.launchpadAuth.refreshCheckTimeInMinutes),
    )
  ) {
    // id_token is valid - continue
    logger.debug('id_token valid')
    return next()
  }

  const parsedRefreshToken = JSON.parse(Buffer.from(req.user.refreshToken.split('.')[1], 'base64').toString())

  // id_token is invalid and refresh_token is valid
  logger.debug('Check refresh_token')
  if (
    tokenHasNotExpired(
      parsedRefreshToken,
      millisecondsMinusMinutesInSeconds(Date.now(), config.apis.launchpadAuth.refreshCheckTimeInMinutes),
    )
  ) {
    logger.debug('Refresh token valid')
    try {
      const updatedTokensResponse: UpdatedTokensResponse = await updateToken(refreshToken)
      logger.debug('Updated user token')

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
      logger.error(`Token refresh error:`, error.stack)
      // Handle the error here
      return res.redirect('/autherror')
    }
  }
  logger.debug('Refresh token invalid')

  // id_token is invalid and refresh_token is invalid
  // refresh / get id_token and refresh_token by redirecting to /sign-in - need to sign out first?
  return res.redirect('/sign-in')
}
