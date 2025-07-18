import { format, isValid, parseISO } from 'date-fns'
import config from '../config'
import { Establishment } from '../@types/launchpad'

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

export const getEstablishmentData = (agencyId: string, configData = config) => {
  try {
    const establishmentData: Establishment = configData.establishments.find(
      (establishment: Establishment) => establishment.agencyId === agencyId,
    )

    return establishmentData
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return null
  }
}

export const toSentenceCase = (str: string): string => {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export type LocationReplacement = {
  match: string
  replacement: string
}
export const convertLocation = (
  location: string,
  replacements: LocationReplacement[] = [{ match: 'cell swap', replacement: 'On-wing activity' }],
) => {
  let convertedLocation = location

  if (typeof location === 'string') {
    replacements.forEach(replacement => {
      const replacementRegExp = new RegExp(`${replacement.match}`, 'gi')
      convertedLocation = convertedLocation.replaceAll(replacementRegExp, replacement.replacement)
    })
  }

  return convertedLocation
}

export const formatLogMessage = (logText: string, prisonerId?: string, agencyId?: string) => {
  return { logText, prisonerId, agencyId }
}
