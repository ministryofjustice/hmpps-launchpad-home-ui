import { format, formatISO, isValid, Locale, parseISO, startOfMonth, subMonths } from 'date-fns'
import { cy, enGB } from 'date-fns/locale'
import { DateFormats } from '../../constants/date'

export const createDateSelectionRange = (language: string, selectedDate?: string, amount = 12) => {
  const locales: Record<string, Locale> = { en: enGB, cy }

  const locale = locales[language] || enGB

  return Array.from({ length: amount }, (_, index) => {
    const current = subMonths(new Date(), index)
    const isSelected = selectedDate ? format(current, 'yyyy-MM') === format(new Date(selectedDate), 'yyyy-MM') : false

    return {
      text: format(current, 'MMMM yyyy', { locale }),
      value: formatISO(startOfMonth(current), { representation: 'date' }),
      selected: isSelected,
    }
  })
}

export const formatDate = (date: string, dateFormat: DateFormats): string | null =>
  isValid(new Date(date)) ? format(parseISO(date), dateFormat) : null

export const sortByDateTime = (dateTime1: string, dateTime2: string, sortOrder: 'asc' | 'desc' = 'asc'): number => {
  const timestamp1 = dateTime1 ? parseISO(dateTime1).valueOf() : 0
  const timestamp2 = dateTime2 ? parseISO(dateTime2).valueOf() : 0

  if (sortOrder === 'asc') {
    return timestamp1 - timestamp2
  }

  return timestamp2 - timestamp1
}
