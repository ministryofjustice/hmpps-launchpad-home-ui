import { format, formatDate, isValid, parseISO } from 'date-fns'
import config from '../config'

export const properCase = (word: string): string =>
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

export const formatDateTimeString = (from: string, to: string, dateTimeFormat: string): string =>
  `${formatDate(new Date(from), dateTimeFormat)} to ${formatDate(new Date(to), dateTimeFormat)}`

export const formatDateOrDefault = (placeHolder: string, dateFormat: string, date: string): string => {
  if (!isValid(parseISO(date))) {
    return placeHolder
  }
  return format(parseISO(date), dateFormat)
}

export const generateBasicAuthHeader = (clientId: string, clientSecret: string): string => {
  const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  return `Basic ${token}`
}

export const getEstablishmentLinksData = (agencyId: string) => {
  try {
    const { prisonerContentHubURL, selfServiceURL, hideHomepageEventsSummaryAndProfileLinkTile } =
      config.establishments.find(establishment => establishment.agencyId === agencyId)

    return { prisonerContentHubURL, selfServiceURL, hideHomepageEventsSummaryAndProfileLinkTile }
  } catch (err) {
    return null
  }
}
