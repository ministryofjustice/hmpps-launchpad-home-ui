import { addDays, format, isBefore, isValid, parseISO } from 'date-fns'
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

    const { fromDate, language } = options
    const fromDateString: string = format(fromDate, DateFormats.ISO_DATE)
    const todaysDate = new Date()

    this.timetable.events[fromDateString] = Timetable.createNewTableRow({
      title: Timetable.getTimetableRowTitle(fromDateString, language),
      hasDateElapsed: isBefore(fromDate, todaysDate),
    })
  }

  static create(options: TimetableOptions) {
    const { fromDate, toDate, language } = options
    return new Timetable({ fromDate, toDate: toDate || fromDate, language })
  }

  static createNewTableRow(options: NewTableRowOptions) {
    const { title, hasDateElapsed } = options
    const timetableRow: TimetableRow = {
      morning: {
        finished: hasDateElapsed,
        events: [],
      },
      afternoon: {
        finished: hasDateElapsed,
        events: [],
      },
      evening: {
        finished: hasDateElapsed,
        events: [],
      },
      title,
    }
    return timetableRow
  }

  static getTimetableRowTitle(date: string, language: string) {
    const givenDate = new Date(date)

    if (!isValid(givenDate)) return ''

    const today = new Date()
    const tomorrow = addDays(today, 1)
    const todayDateString = format(today, DateFormats.LONG_PRETTY_DATE, {
      locale: language === 'cy' ? cy : enGB,
    })
    const tomorrowDateString = format(tomorrow, DateFormats.LONG_PRETTY_DATE, {
      locale: language === 'cy' ? cy : enGB,
    })
    const givenDateString = format(givenDate, DateFormats.LONG_PRETTY_DATE, {
      locale: language === 'cy' ? cy : enGB,
    })

    if (givenDateString === todayDateString) {
      return i18next.t('timetable.today', { lng: language })
    }

    if (givenDateString === tomorrowDateString) {
      return i18next.t('timetable.tomorrow', { lng: language })
    }

    return givenDateString
  }

  addEvents(language: string, events: ScheduledEvent[] = []) {
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
