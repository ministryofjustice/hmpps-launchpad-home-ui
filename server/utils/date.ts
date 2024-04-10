import { format, isValid, parseISO } from 'date-fns'

export const formatDate = (date: Date, dateTimeFormat: string): string => format(date, dateTimeFormat)

export const formatDateTimeString = (from: string, to: string, dateTimeFormat: string): string =>
  `${formatDate(new Date(from), dateTimeFormat)} to ${formatDate(new Date(to), dateTimeFormat)}`

export const formatDateOrDefault = (placeHolder: string, dateFormat: string, date: string): string => {
  if (!isValid(parseISO(date))) {
    return placeHolder
  }
  return format(parseISO(date), dateFormat)
}
