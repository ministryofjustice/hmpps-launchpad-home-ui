import { addDays, format, isAfter, isBefore, isToday, isTomorrow, isValid, parseISO } from 'date-fns'
import { enGB, cy } from 'date-fns/locale'
import i18next from 'i18next'

import { NewTableRowOptions, TimetableOptions, TimetableRow, TimetableState } from '../@types/launchpad'
import { ScheduledEvent } from '../@types/prisonApiTypes'
import { DateFormats } from '../constants/date'
import { TimetableValues } from '../constants/timetable'
import TimetableEvent from './timetableEvent'

const isoDate = (date: string) => {
  if (!isValid(new Date(date))) return ''
  return format(parseISO(date), DateFormats.ISO_DATE)
}

const getTimeOfDay = (date: string) => {
  const dateObject = new Date(date)
  if (!isValid(dateObject)) return ''

  const dateString = isoDate(date)

  if (isBefore(dateObject, parseISO(`${dateString} 12.00.00`))) {
    return TimetableValues.MORNING
  }

  if (isBefore(dateObject, parseISO(`${dateString} 17.00.00`))) {
    return TimetableValues.AFTERNOON
  }

  return TimetableValues.EVENING
}

export default class Timetable {
  timetable: TimetableState

  constructor(options: TimetableOptions) {
    this.timetable = {
      events: {},
      hasEvents: false,
    }

    const { fromDate, toDate, language } = options
    const todaysDate = new Date()

    for (let currentDate = fromDate; !isAfter(currentDate, toDate); currentDate = addDays(currentDate, 1)) {
      const key = format(currentDate, DateFormats.ISO_DATE)
      this.timetable.events[key] = Timetable.createNewTableRow({
        title: Timetable.getTimetableRowTitle(key, language),
        hasDateElapsed: isBefore(currentDate, todaysDate),
      })
    }
  }

  static create(options: TimetableOptions): Timetable {
    const { fromDate, toDate, language } = options
    return new Timetable({ fromDate, toDate: toDate || fromDate, language })
  }

  static createNewTableRow(options: NewTableRowOptions): TimetableRow {
    const { title, hasDateElapsed } = options
    return {
      morning: { finished: hasDateElapsed, events: [] },
      afternoon: { finished: hasDateElapsed, events: [] },
      evening: { finished: hasDateElapsed, events: [] },
      title,
    }
  }

  static getTimetableRowTitle(date: string, language: string): string {
    const givenDate = new Date(date)
    if (!isValid(givenDate)) return ''

    if (isToday(givenDate)) {
      return i18next.t('timetable.today', { lng: language })
    }
    if (isTomorrow(givenDate)) {
      return i18next.t('timetable.tomorrow', { lng: language })
    }
    return format(givenDate, DateFormats.LONG_PRETTY_DATE, {
      locale: { en: enGB, cy }[language],
    })
  }

  addEvents(language: string, events: ScheduledEvent[] = []): Timetable {
    if (!Array.isArray(events)) {
      throw new Error('Events must be an array')
    }

    this.timetable.hasEvents = true

    events.forEach(event => {
      const eventDate = isoDate(event.startTime)
      const timeOfDay = getTimeOfDay(event.startTime)

      if (timeOfDay === '') {
        throw new Error(`Invalid time of day for event on ${eventDate}`)
      }

      if (!this.timetable.events[eventDate]) {
        this.timetable.events[eventDate] = Timetable.createNewTableRow({
          title: Timetable.getTimetableRowTitle(eventDate, language),
          hasDateElapsed: isBefore(new Date(eventDate), new Date()),
        })
      }

      if (!this.timetable.events[eventDate][timeOfDay]) {
        this.timetable.events[eventDate][timeOfDay] = { finished: false, events: [] }
      }

      this.timetable.events[eventDate][timeOfDay].events.push(TimetableEvent.from(event).format(language))
    })

    this.setEventStatesForToday()

    return this
  }

  setEventStatesForToday() {
    const todaysDate = format(new Date(), DateFormats.ISO_DATE)

    if (this.timetable.events[todaysDate]) {
      const todaysDateAndTime = format(new Date(), DateFormats.ISO_DATE_TIME)
      const currentTimeOfDay = getTimeOfDay(todaysDateAndTime)

      this.timetable.events[todaysDate][TimetableValues.MORNING].finished = false
      this.timetable.events[todaysDate][TimetableValues.AFTERNOON].finished = false
      this.timetable.events[todaysDate][TimetableValues.EVENING].finished = false

      if (currentTimeOfDay === TimetableValues.AFTERNOON) {
        this.timetable.events[todaysDate][TimetableValues.MORNING].finished = true
      } else if (currentTimeOfDay === TimetableValues.EVENING) {
        this.timetable.events[todaysDate][TimetableValues.MORNING].finished = true
        this.timetable.events[todaysDate][TimetableValues.AFTERNOON].finished = true
      }
    }

    return this
  }

  build() {
    return this.timetable
  }
}
