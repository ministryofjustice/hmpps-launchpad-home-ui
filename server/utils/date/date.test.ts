import { format, formatISO, startOfMonth, subMonths } from 'date-fns'
import { enGB, cy } from 'date-fns/locale'
import { createDateSelectionRange } from './date'

describe(createDateSelectionRange.name, () => {
  const defaultLanguage = 'en'

  it('should create an array of length amount', () => {
    const amount = 12
    const selectionRange = createDateSelectionRange(defaultLanguage, undefined, amount)
    expect(selectionRange).toHaveLength(amount)
  })

  it('should create selection range with correct text and value in English', () => {
    const selectionRange = createDateSelectionRange('en')
    const currentDate = new Date()
    selectionRange.forEach((item, index) => {
      const expectedDate = subMonths(currentDate, index)
      const expectedText = format(expectedDate, 'MMMM yyyy', { locale: enGB })
      const expectedValue = formatISO(startOfMonth(expectedDate), { representation: 'date' })

      expect(item.text).toBe(expectedText)
      expect(item.value).toBe(expectedValue)
    })
  })

  it('should create selection range with correct text and value in Welsh', () => {
    const selectionRange = createDateSelectionRange('cy')
    const currentDate = new Date()
    selectionRange.forEach((item, index) => {
      const expectedDate = subMonths(currentDate, index)
      const expectedText = format(expectedDate, 'MMMM yyyy', { locale: cy })
      const expectedValue = formatISO(startOfMonth(expectedDate), { representation: 'date' })

      expect(item.text).toBe(expectedText)
      expect(item.value).toBe(expectedValue)
    })
  })

  it('should select the correct date if selectedDate is provided', () => {
    const selectedDate = '2024-02-15'
    const selectionRange = createDateSelectionRange(defaultLanguage, selectedDate)
    const selectedYearMonth = selectedDate.substring(0, 7)

    selectionRange.forEach(item => {
      const itemYearMonth = item.value.substring(0, 7)
      expect(item.selected).toBe(itemYearMonth === selectedYearMonth)
    })
  })

  it('should not select any date if selectedDate is not provided', () => {
    const selectionRange = createDateSelectionRange(defaultLanguage)
    selectionRange.forEach(item => {
      expect(item.selected).toBeFalsy()
    })
  })

  it('should default to English locale if an unknown language is provided', () => {
    const selectionRange = createDateSelectionRange('unknown')
    const currentDate = new Date()
    selectionRange.forEach((item, index) => {
      const expectedDate = subMonths(currentDate, index)
      const expectedText = format(expectedDate, 'MMMM yyyy', { locale: enGB })
      const expectedValue = formatISO(startOfMonth(expectedDate), { representation: 'date' })

      expect(item.text).toBe(expectedText)
      expect(item.value).toBe(expectedValue)
    })
  })
})
