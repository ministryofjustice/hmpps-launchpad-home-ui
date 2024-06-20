import {
  convertToTitleCase,
  generateBasicAuthHeader,
  getEstablishmentLinksData,
  initialiseName,
  toSentenceCase,
} from './utils'

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('authentication', () => {
  describe('generate basic auth header', () => {
    let clientId: string
    let clientSecret: string
    let base64EncodedToken: string

    beforeEach(() => {
      clientId = 'clientid'
      clientSecret = 'clientsecret'
      base64EncodedToken = 'Basic Y2xpZW50aWQ6Y2xpZW50c2VjcmV0'
    })

    afterEach(() => {
      clientId = null
      clientSecret = null
      base64EncodedToken = null
    })

    it('it should return the expected base64 encoded basic auth header string', () => {
      expect(generateBasicAuthHeader(clientId, clientSecret)).toEqual(base64EncodedToken)
    })
  })
})

describe('get establishment link data', () => {
  let agencyId: string
  let establishmentLinksData: {
    prisonerContentHubURL: string
    selfServiceURL: string
  }

  beforeEach(() => {
    agencyId = 'CKI'
    establishmentLinksData = {
      prisonerContentHubURL: 'https://cookhamwood.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://ckiclient.unilink.prisoner.service.justice.gov.uk:82',
    }
  })

  afterEach(() => {
    agencyId = null
    establishmentLinksData = null
  })

  it('it should return the expected establishment links data for the provided agency id', () => {
    expect(getEstablishmentLinksData(agencyId)).toEqual(establishmentLinksData)
  })

  it('it should return null when an unknown agency id is provided', () => {
    expect(getEstablishmentLinksData('ABC')).toBeNull()
  })
})

describe('toSentenceCase', () => {
  it('should convert an uppercase string to sentence case', () => {
    const input = 'THIS IS AN UPPERCASE STRING'
    const expectedOutput = 'This is an uppercase string'
    expect(toSentenceCase(input)).toBe(expectedOutput)
  })

  it('should convert a mixed-case string to sentence case', () => {
    const input = 'tHiS Is a MiXeD CaSe StRiNg'
    const expectedOutput = 'This is a mixed case string'
    expect(toSentenceCase(input)).toBe(expectedOutput)
  })

  it('should convert a lowercase string to sentence case', () => {
    const input = 'this is a lowercase string'
    const expectedOutput = 'This is a lowercase string'
    expect(toSentenceCase(input)).toBe(expectedOutput)
  })

  it('should handle an empty string', () => {
    const input = ''
    const expectedOutput = ''
    expect(toSentenceCase(input)).toBe(expectedOutput)
  })

  it('should handle a string with one character', () => {
    const input = 'a'
    const expectedOutput = 'A'
    expect(toSentenceCase(input)).toBe(expectedOutput)
  })

  it('should handle a string with one uppercase character', () => {
    const input = 'A'
    const expectedOutput = 'A'
    expect(toSentenceCase(input)).toBe(expectedOutput)
  })

  it('should handle a string with special characters', () => {
    const input = '!@#$%^&*()'
    const expectedOutput = '!@#$%^&*()'
    expect(toSentenceCase(input)).toBe(expectedOutput)
  })

  it('should handle a string with numbers', () => {
    const input = '12345'
    const expectedOutput = '12345'
    expect(toSentenceCase(input)).toBe(expectedOutput)
  })

  it('should handle a string with leading spaces', () => {
    const input = '    leading spaces'
    const expectedOutput = '    leading spaces'
    expect(toSentenceCase(input)).toBe(expectedOutput)
  })

  it('should handle a string with trailing spaces', () => {
    const input = 'trailing spaces    '
    const expectedOutput = 'Trailing spaces    '
    expect(toSentenceCase(input)).toBe(expectedOutput)
  })

  it('should handle a string with leading and trailing spaces', () => {
    const input = '    leading and trailing spaces    '
    const expectedOutput = '    leading and trailing spaces    '
    expect(toSentenceCase(input)).toBe(expectedOutput)
  })
})
