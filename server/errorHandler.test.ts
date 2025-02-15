import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './routes/testutils/appSetup'

const mockTranslations: Record<string, string> = {
  'errorPage.error': 'Something went wrong',
  'errorPage.problemLoading': 'There was a problem loading the page.',
  'errorPage.goBackHome': 'Go back to home page',
}

jest.mock('i18next', () => ({
  t: (key: string) => mockTranslations[key] || key,
}))

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET 404', () => {
  it('should render content with stack in dev mode', () => {
    return request(app)
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Something went wrong')
        expect(res.text).toContain('NotFoundError: Not found')
      })
  })

  it('should render content without stack in production mode', () => {
    return request(appWithAllRoutes({ production: true }))
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Something went wrong')
        expect(res.text).not.toContain('NotFoundError: Not found')
      })
  })
})
