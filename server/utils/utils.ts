import type { Request, Response, NextFunction } from 'express'
import superagent from 'superagent'
import { format, isValid, parseISO, startOfMonth, subMonths, formatISO, endOfMonth, isFuture } from 'date-fns'
import {
  IdToken,
  RefreshToken,
  UpdatedTokensResponse,
  ProcesseSelectedTransactionDates,
  ProcessedDateSelection,
} from '../@types/launchpad'
import logger from '../../logger'
import config from '../config'
// import { Agency, OffenderTransactionHistoryDto } from '../@types/prisonApiTypes'

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

export const formatDate = (date: Date, dateTimeFormat: string): string => format(date, dateTimeFormat)

export const formatDateTimeString = (from: string, to: string, dateTimeFormat: string): string =>
  `${formatDate(new Date(from), dateTimeFormat)} to ${formatDate(new Date(to), dateTimeFormat)}`

export const formatDateOrDefault = (placeHolder: string, dateFormat: string, date: string): string => {
  if (!isValid(parseISO(date))) {
    return placeHolder
  }
  return format(parseISO(date), dateFormat)
}

const getDateSelection = (date: Date, selectedDate: Date, amount = 12): ProcessedDateSelection[] => {
  const startDate: Date = startOfMonth(date)
  const dateRange: ProcessedDateSelection[] = []

  for (let offset = 0; offset < amount; offset += 1) {
    const current: Date = subMonths(startDate, offset)
    const element: ProcessedDateSelection = {
      text: format(current, 'MMMM yyyy'),
      value: formatISO(current, { representation: 'date' }),
    }

    if (selectedDate && startOfMonth(selectedDate).valueOf() === current.valueOf()) {
      element.selected = true
    }

    dateRange.push(element)
  }

  return dateRange
}

const isValidDateSelection = (selectedDate: string, dateSelection: ProcessedDateSelection[]) => {
  return dateSelection.filter(d => selectedDate === d.value).length > 0
}

export const processSelectedDate = (selectedDate: string | undefined): ProcesseSelectedTransactionDates => {
  const dateSelection = getDateSelection(new Date(), parseISO(selectedDate))

  const fromDate = isValidDateSelection(selectedDate, dateSelection) ? parseISO(selectedDate) : startOfMonth(new Date())

  const endOfSelectedMonth = endOfMonth(fromDate)

  const toDate = !isFuture(endOfSelectedMonth) ? endOfSelectedMonth : new Date()

  return {
    dateSelection,
    fromDate,
    toDate,
  }
}

export const generateBasicAuthHeader = (clientId: string, clientSecret: string): string => {
  const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  return `Basic ${token}`
}

export const getEstablishmentLinksData = (agencyId: string) => {
  try {
    const { prisonerContentHubURL, selfServiceURL } = config.establishments.find(
      establishment => establishment.agencyId === agencyId,
    )

    return { prisonerContentHubURL, selfServiceURL }
  } catch (err) {
    return null
  }
}
