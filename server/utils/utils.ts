import { format } from 'date-fns'
import type { Request, Response, NextFunction } from 'express'
import superagent from 'superagent'
import passport from 'passport'
import { IdToken, RefreshToken } from '../@types/launchpad'
import logger from '../../logger'
import config from '../config'

const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export const formatDate = (date: Date): string => {
  return format(date, 'EEEE d MMMM, yyyy')
}

export const generateBasicAuthHeader = (clientId: string, clientSecret: string): string => {
  const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  return `Basic ${token}`
}

export const createUserObject = (idToken: string, refreshToken: string, accessToken: string) => {
  return {
    idToken: JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString()),
    refreshToken,
    accessToken,
    token: accessToken,
  }
}

export const nowMinus5Minutes = (): number => {
  const oneSecondInMillis = 1000
  const fiveMinutesInMillis = 300 * oneSecondInMillis
  const nowEpochInSeconds = Math.floor((Date.now() - fiveMinutesInMillis) / oneSecondInMillis)

  return nowEpochInSeconds
}

export const tokenIsValid = (token: RefreshToken | IdToken, nowEpochMinus5Minutes: number): boolean =>
  !(nowEpochMinus5Minutes > token.exp)

export const updateToken = (refreshToken: RefreshToken) => {
  const url = `${config.apis.launchpadAuth.externalUrl}/v1/oauth2/token`
  const grantType = 'refresh_token'
  const authHeaderValue = generateBasicAuthHeader(
    `${config.apis.launchpadAuth.apiClientId}`,
    `${config.apis.launchpadAuth.apiClientSecret}`,
  )

  const refreshedTokens = new Promise((resolve, reject) => {
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

export const checkTokenValidityAndUpdate = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next()
  }
  const { idToken, refreshToken } = req.user

  if (idToken && refreshToken) {
    if (tokenIsValid(idToken, nowMinus5Minutes())) {
      console.log('id_token is valid')
      return next()
    }

    // also use this logic for try again button and access_token refresh (settings page)
    if (tokenIsValid(refreshToken, nowMinus5Minutes())) {
      console.log('id_token is invalid and refresh_token is valid')

      try {
        const updatedToken = await updateToken(refreshToken)

        console.log('req.session.passport.user', req.session.passport.user)
        // return createUserObject(updatedToken.id_token, updatedToken.refresh_token, updatedToken.access_token))
        // req.user = createUserObject(updatedToken.id_token, updatedToken.refresh_token, updatedToken.access_token)
        req.session.passport.user = createUserObject(updatedToken.id_token, updatedToken.refresh_token, updatedToken.access_token)
        // passport.serializeUser((user, cb) => {
        //   process.nextTick(() => {
        //     cb(null, user)
        //   })
        // })
        console.log('req.session.passport.user 2', req.session.passport.user)

        // console.log('req.session.user ', req.session.user)
        // req.session.user = req.user

        // passport.serializeUser((usr, done) => {
        //   done(null, usr) // Serialize the user by their ID
        // })

        return next()
      } catch (error) {
        logger.error(`Token refresh error:`, error.stack)
        // Handle the error here
        res.redirect('/autherror')
      }
    }

    // id_token is invalid and refresh_token is invalid
    // refresh / get id_token and refresh_token by redirecting to /sign-in - need to sign out first?
    res.redirect('/sign-in')
  }

  logger.error('Missing idToken or refreshToken')
  // go to landing page '/' to initiate sign in flow
  return res.redirect('/sign-in')
}
