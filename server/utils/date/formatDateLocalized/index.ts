import { format } from 'date-fns'
import i18next from 'i18next'

import { DateFormats } from '../../../constants/date'

// eslint-disable-next-line import/prefer-default-export
export const formatDateLocalized = (date: Date, formatPattern: DateFormats, language: string): string => {
  const day = format(date, 'EEEE')
  const month = format(date, 'MMMM')

  const translatedDay = i18next.t(`days.${day.toLowerCase()}`, { lng: language })
  const translatedMonth = i18next.t(`months.${month.toLowerCase()}`, { lng: language })

  return format(date, formatPattern).replace(day, translatedDay).replace(month, translatedMonth)
}
