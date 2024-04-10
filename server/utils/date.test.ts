import { formatDate, formatDateOrDefault, formatDateTimeString } from './date'
import { DateFormats } from './enums'

describe(formatDate.name, () => {
  it('should format date correctly', () => {
    const date = new Date('2024-04-10T12:00:00Z')
    const formattedDate = formatDate(date, DateFormats.PRETTY_DATE)
    expect(formattedDate).toEqual('Wednesday 10 April, 2024')
  })
})

describe(formatDateTimeString.name, () => {
  it('should format date-time string correctly', () => {
    const formattedString = formatDateTimeString('2024-04-10T12:00:00', '2024-04-11T12:00:00', DateFormats.PRETTY_TIME)
    expect(formattedString).toEqual('12.00pm to 12.00pm')
  })
})

describe(formatDateOrDefault.name, () => {
  it('should return placeholder if date is invalid', () => {
    const placeHolder = 'Invalid Date'
    const invalidDateString = 'invalid date'
    const formattedDate = formatDateOrDefault(placeHolder, DateFormats.PRETTY_TIME, invalidDateString)
    expect(formattedDate).toEqual(placeHolder)
  })

  it('should format valid date correctly', () => {
    const placeHolder = 'Invalid Date'
    const validDateString = '2024-04-10T12:00:00Z'
    const formattedDate = formatDateOrDefault(placeHolder, DateFormats.PRETTY_TIME, validDateString)
    expect(formattedDate).toEqual('1.00pm')
  })
})
