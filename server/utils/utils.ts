import { format } from 'date-fns'
import type { Response, NextFunction } from 'express'
import { IdToken, RefreshToken } from '../@types/launchpad'
import logger from '../../logger'

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

export const nowMinus5minutes = (): number => {
  const oneSecondInMillis = 1000
  const fiveMinutesInMillis = 300 * oneSecondInMillis
  const nowEpochInSeconds = Math.round(new Date().getTime() - fiveMinutesInMillis / oneSecondInMillis)

  return nowEpochInSeconds
}

export const tokenIsValid = (token: RefreshToken | IdToken, nowEpochMinus5Minutes: number): boolean =>
  !(nowEpochMinus5Minutes > token.exp)

/*
  REFRESH TOKEN
  
  - To obtain a new token if access token (valid for 1 hour) has expired or id token (valid for 12 hours) has expired
    - If refresh token (valid for 7 days) !expired - get a new token
    - else if refresh token also expired - get new a token by forcing sign-in again - redirect to /sign-in
*/
export const checkTokenValidityAndUpdate = (res: Response, next: NextFunction): void => {
  if (!res.locals.user) {
    return next()
  }

  const idToken = res.locals?.user?.accessToken
  const refreshToken = res.locals?.user?.refreshToken

  if (idToken && refreshToken) {
    if (tokenIsValid(idToken, nowMinus5minutes())) {
      console.log('id token is valid')
      return next()
    }

    if (tokenIsValid(refreshToken, nowMinus5minutes())) {
      // id_token is invalid and refresh_token is valid
      console.log('id_token is invalid and refresh_token is valid')
      try {
        // refresh / get new id_token
        // save new access token to res.locals.user
        return next()
      } catch (error) {
        logger.error(`Token refresh error:`, error.stack)
        return res.redirect('/sign-out')
      }
    }

    // id_token is invalid and refresh_token is invalid
    // refresh / get id_token and refresh_token by redirecting to /sign-in - need to sign out first?
    res.redirect('/sign-in')
  }

  logger.error('Missing idToken or refreshToken')
  return res.redirect('/sign-out')
}
