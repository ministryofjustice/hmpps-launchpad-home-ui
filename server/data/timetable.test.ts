import i18next from 'i18next'
import { addDays } from 'date-fns'
import Timetable from './timetable'
import { ScheduledEvent } from '../@types/prisonApiTypes'
import { TimetableRow } from '../@types/launchpad'

describe('Timetable', () => {
  const today = new Date('2026-01-01')

  const emptyEvent: ScheduledEvent = {
    bookingId: 1,
    startTime: '',
    eventClass: '',
    eventStatus: '',
    eventType: '',
    eventTypeDesc: '',
    eventSubType: '',
    eventSubTypeDesc: '',
    eventDate: '',
    eventSource: '',
  }

  const numberOfEvents = ({ morning, afternoon, evening }: TimetableRow): [number, number, number] => {
    return [morning.events.length, afternoon.events.length, evening.events.length]
  }

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(today)
    i18next.init()
  })

  it('creates a slot for every day in the given range', () => {
    // Create a timetable spanning 7 days including today
    const timetable = new Timetable({ fromDate: today, toDate: addDays(today, 6), language: 'en' })

    const { events } = timetable.build()

    // Expect to see all seven days with correct title
    const datesAndTitles = Object.entries(events).map(([date, event]) => [date, event.title])
    expect(datesAndTitles).toEqual([
      ['2026-01-01', 'timetable.today'], // i18n key for Today
      ['2026-01-02', 'timetable.tomorrow'], // i18n key for Tomorrow
      ['2026-01-03', 'Saturday 3 January'],
      ['2026-01-04', 'Sunday 4 January'],
      ['2026-01-05', 'Monday 5 January'],
      ['2026-01-06', 'Tuesday 6 January'],
      ['2026-01-07', 'Wednesday 7 January'],
    ])
  })

  it('adding events puts them into the correct days within the time span', () => {
    // Create a timetable spanning 7 days including today
    const timetable = new Timetable({ fromDate: today, toDate: addDays(today, 6), language: 'en' })

    // Add events within that time window
    timetable.addEvents('en', [
      { ...emptyEvent, startTime: '2026-01-01 09:30:00', eventSubTypeDesc: 'Morning of the 1st January 2026' },
      { ...emptyEvent, startTime: '2026-01-04 17:30:00', eventSubTypeDesc: 'Evening of the 4th January 2026' },
      { ...emptyEvent, startTime: '2026-01-05 13:00:00', eventSubTypeDesc: 'Afternoon of the 5th January 2026' },
      { ...emptyEvent, startTime: '2026-01-05 19:00:00', eventSubTypeDesc: 'Evening of the 5th January 2026' },
      { ...emptyEvent, startTime: '2026-01-05 19:30:00', eventSubTypeDesc: 'Evening event 2 of the 5th January 2026' },
    ])

    const { events } = timetable.build()

    // Expect events to have been put in correct day slots
    expect(numberOfEvents(events['2026-01-01'])).toEqual([1, 0, 0])
    expect(numberOfEvents(events['2026-01-02'])).toEqual([0, 0, 0])
    expect(numberOfEvents(events['2026-01-03'])).toEqual([0, 0, 0])
    expect(numberOfEvents(events['2026-01-04'])).toEqual([0, 0, 1])
    expect(numberOfEvents(events['2026-01-05'])).toEqual([0, 1, 2])
    expect(numberOfEvents(events['2026-01-06'])).toEqual([0, 0, 0])
    expect(numberOfEvents(events['2026-01-07'])).toEqual([0, 0, 0])

    // Check the details of those events
    expect(events['2026-01-01'].morning.events[0].description).toEqual('Morning of the 1st January 2026')
    expect(events['2026-01-04'].evening.events[0].description).toEqual('Evening of the 4th January 2026')
    expect(events['2026-01-05'].afternoon.events[0].description).toEqual('Afternoon of the 5th January 2026')
    expect(events['2026-01-05'].evening.events[0].description).toEqual('Evening of the 5th January 2026')
    expect(events['2026-01-05'].evening.events[1].description).toEqual('Evening event 2 of the 5th January 2026')
  })
})
