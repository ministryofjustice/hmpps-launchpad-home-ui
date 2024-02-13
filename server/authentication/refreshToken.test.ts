import { generateBasicAuthHeader } from '../utils/utils'
import { createUserObject, millisecondsMinusMinutesInSeconds, tokenIsValid } from './refreshToken'

describe('authentication', () => {
  let idToken: string
  let refreshToken: string
  let accessToken: string
  let user: Express.User

  beforeEach(() => {
    idToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiWUtBRVNTVU1BUiBBTE9SRVMiLCJnaXZlbl9uYW1lIjoiWUtBRVNTVU1BUiIsImZhbWlseV9uYW1lIjoiQUxPUkVTIiwiaWF0IjoxNjk3NzA3ODgxLCJhdWQiOiIwNzFlZjYyOC02ZGNjLTRhNjMtOTJkMC1mNzdiMWFkOGUwNjAiLCJzdWIiOiJHMjMyMFZEIiwiZXhwIjoxNjk3NzA0MzQxLCJib29raW5nIjp7ImlkIjoiNzczNDIzIn0sImVzdGFibGlzaG1lbnQiOnsiaWQiOiIiLCJhZ2VuY3lfaWQiOiIxMDA1OTI0ZC1iNTU0LTQ2NGQtOGVmZi01MmI2MmQyOGRhMzMiLCJuYW1lIjoiSE1QU1NfTG9uZG9uIiwiZGlzcGxheV9uYW1lIjoiSE1QU1NfTG9uZG9uIiwieW91dGgiOmZhbHNlfSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3YxL29hdXRoMiJ9.D4q1k-o4f7DUKvbLbthhESph3XW49_WW3-aprujlGXo'
    refreshToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZWQwOTUwYS0zNGVhLTQxODYtYWM1YS1kOWI0NTRhZmE0Y2IiLCJhdGkiOiIwMzNhY2JlZi1kY2QwLTQwNzktODI4MC0yMjQ5OGQzYWFkODIiLCJpYXQiOjE2OTc3MDUzOTIsImF1ZCI6IjA3MWVmNjI4LTZkY2MtNGE2My05MmQwLWY3N2IxYWQ4ZTA2MCIsInN1YiI6IkcyMzIwVkQiLCJleHAiOjE2OTgzMTAxOTIsInNjb3BlcyI6WyJ1c2VyLmJvb2tpbmcucmVhZCIsInVzZXIuZXN0YWJsaXNobWVudC5yZWFkIiwidXNlci5iYXNpYy5yZWFkIiwidXNlci5jbGllbnRzLmRlbGV0ZSIsInVzZXIuY2xpZW50cy5yZWFkIl19.0Ae0_QSURC3N6Gzk5ZN5xRSUAOPJRsRd98f74fn5vl4'
    accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMzNhY2JlZi1kY2QwLTQwNzktODI4MC0yMjQ5OGQzYWFkODIiLCJpYXQiOjE2OTc3MDc4ODEsImF1ZCI6IjA3MWVmNjI4LTZkY2MtNGE2My05MmQwLWY3N2IxYWQ4ZTA2MCIsInN1YiI6IkcyMzIwVkQiLCJleHAiOjE2OTc3MTE0ODEsInNjb3BlcyI6WyJ1c2VyLmJvb2tpbmcucmVhZCIsInVzZXIuZXN0YWJsaXNobWVudC5yZWFkIiwidXNlci5iYXNpYy5yZWFkIiwidXNlci5jbGllbnRzLmRlbGV0ZSIsInVzZXIuY2xpZW50cy5yZWFkIl19.F_nyML7to1JVYRF1unFrATuHmwcwB8aNZqBneQ6UpdU'
    user = {
      idToken: {
        name: 'YKAESSUMAR ALORES',
        given_name: 'YKAESSUMAR',
        family_name: 'ALORES',
        iat: 1697707881,
        aud: '071ef628-6dcc-4a63-92d0-f77b1ad8e060',
        sub: 'G2320VD',
        exp: 1697704341,
        booking: { id: '773423' },
        establishment: {
          id: '',
          agency_id: '1005924d-b554-464d-8eff-52b62d28da33',
          name: 'HMPSS_London',
          display_name: 'HMPSS_London',
          youth: false,
        },
        iss: 'http://localhost:8080/v1/oauth2',
      },
      refreshToken,
      accessToken,
      token: accessToken,
    }
  })

  afterEach(() => {
    idToken = null
    refreshToken = null
    accessToken = null
    user = null
  })

  it('it should return a user object with the expected structure from the tokens provided', () => {
    expect(createUserObject(idToken, refreshToken, accessToken)).toEqual(user)
  })

  describe('token validity', () => {
    it('it should return a false when the provided id token is invalid', () => {
      const nowEpochMinus5Minutes = user.idToken.exp + 1
      expect(tokenIsValid(user.idToken, nowEpochMinus5Minutes)).toEqual(false)
    })

    it('it should return a true when the provided id token is valid', () => {
      const nowEpochMinus5Minutes = user.idToken.exp
      expect(tokenIsValid(user.idToken, nowEpochMinus5Minutes)).toEqual(true)
    })

    it('it should return a false when the provided refresh token is invalid', () => {
      const parsedRefreshToken = JSON.parse(Buffer.from(user.refreshToken.split('.')[1], 'base64').toString())
      const nowEpochMinus5Minutes = parsedRefreshToken.exp + 1
      expect(tokenIsValid(parsedRefreshToken, nowEpochMinus5Minutes)).toEqual(false)
    })

    it('it should return a true when the provided refresh token is valid', () => {
      const parsedRefreshToken = JSON.parse(Buffer.from(user.refreshToken.split('.')[1], 'base64').toString())
      const nowEpochMinus5Minutes = parsedRefreshToken.exp
      expect(tokenIsValid(parsedRefreshToken, nowEpochMinus5Minutes)).toEqual(true)
    })
  })

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

describe('now minus X minutes in seconds', () => {
  const cases = [
    [5, 500000, 200],
    [5, 1697709716207, 1697709416],
  ]

  test.each(cases)('subtracts %p minutes from %p milliseconds to give %p seconds', (minutes, now, result) => {
    expect(result).toEqual(millisecondsMinusMinutesInSeconds(now, minutes))
  })
})
