import { DateFormats, TimetableValues } from '../utils/enums'
import { properCase, formatDateOrDefault } from '../utils/utils'

const DEFAULT: string = 'Unavailable'

const getTimetableEventTime = (startTime: string, endTime: string): string => {
  if (startTime === '') {
    return ''
  }

  if (endTime !== '') {
    return `${startTime} to ${endTime}`
  }

  return startTime
}

interface TimetableEventOptions {
  eventSubType?: string
  eventSourceDesc?: string
  eventSubTypeDesc?: string
  startTime?: string
  endTime?: string
  location?: string
  eventType?: string
  status?: string
  paid?: boolean
  eventLocation?: string
  eventStatus?: string
}

export interface TimetableEventFormatted {
  description: string
  startTime: string
  endTime: string
  location: string
  timeString: string
  eventType: string
  finished: boolean
  status: string
  paid: boolean
}

export default class TimetableEvent {
  description: string

  startTime: string

  endTime: string

  location: string

  eventType: string

  status: string

  paid: boolean

  constructor(options: TimetableEventOptions = {}) {
    this.description = (options.eventSubType === 'PA' && options.eventSourceDesc) || options.eventSubTypeDesc || ''
    this.startTime = options.startTime || ''
    this.endTime = options.endTime || ''
    this.location = options.location || ''
    this.eventType = options.eventType || ''
    this.status = options.status || ''
    this.paid = options.paid || false
  }

  format(): TimetableEventFormatted {
    return {
      description: this.description || DEFAULT,
      startTime: formatDateOrDefault('', DateFormats.PRETTY_TIME, this.startTime),
      endTime: formatDateOrDefault('', DateFormats.PRETTY_TIME, this.endTime),
      location: this.location ? properCase(this.location) : DEFAULT,
      timeString: getTimetableEventTime(
        formatDateOrDefault('', DateFormats.PRETTY_TIME, this.startTime),
        formatDateOrDefault('', DateFormats.PRETTY_TIME, this.endTime),
      ),
      eventType: this.eventType || DEFAULT,
      finished: this.status !== TimetableValues.SCHEDULED_EVENT_TYPE,
      status: this.status || DEFAULT,
      paid: this.paid,
    }
  }

  static from(response: TimetableEventOptions = {}): TimetableEvent {
    const {
      startTime,
      endTime,
      eventSourceDesc,
      eventLocation,
      eventType,
      eventSubType,
      eventSubTypeDesc,
      eventStatus,
      paid,
    } = response

    return new TimetableEvent({
      eventSourceDesc,
      startTime,
      endTime,
      location: eventLocation,
      eventType,
      eventSubType,
      eventSubTypeDesc,
      status: eventStatus,
      paid,
    })
  }
}
