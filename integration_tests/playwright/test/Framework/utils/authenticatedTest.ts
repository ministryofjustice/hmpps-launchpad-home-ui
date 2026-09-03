import { createHmac, randomUUID } from 'crypto'
import path from 'path'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { createClient } from 'redis'
import { test as base, expect, type BrowserContext } from '@playwright/test'

const mockEnv = dotenv.config({ path: path.resolve(process.cwd(), 'feature.env') }).parsed || {}

function signCookie(value: string, secret: string): string {
  const signed = createHmac('sha256', secret).update(value).digest('base64').replace(/=+$/, '')
  return `${value}.${signed}`
}

function createMockTokens() {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    sub: 'G3682UE',
    name: 'Test User',
    given_name: 'Test',
    family_name: 'User',
    email: 'test.user@example.com',
    preferred_username: 'G3682UE',
    booking: {
      id: 'G6123VG',
    },
    establishment: {
      agency_id: 'BWI',
      name: 'HMP Berwyn',
      display_name: 'HMP Berwyn',
      youth: false,
    },
    prisoner_number: 'A1234BC',
    iat: now,
    exp: now + 3600,
    iss: 'http://localhost:9091',
    aud: 'clientid',
  }

  const refreshPayload = {
    ...payload,
    type: 'refresh',
    exp: now + 604800,
  }

  return {
    idToken: jwt.sign(payload, 'secret'),
    accessToken: jwt.sign(payload, 'secret'),
    refreshToken: jwt.sign(refreshPayload, 'secret'),
    parsedIdToken: payload,
  }
}

async function createAuthenticatedCookie(
  baseUrl: string,
): Promise<Parameters<BrowserContext['addCookies']>[0][number]> {
  const { idToken, accessToken, refreshToken, parsedIdToken } = createMockTokens()
  const sid = randomUUID()
  const sessionSecret = mockEnv.SESSION_SECRET || 'app-insecure-default-session'
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
  const redisClient = createClient({ url: redisUrl })

  const sessionValue = {
    cookie: {
      originalMaxAge: null,
      expires: null,
      secure: false,
      httpOnly: true,
      path: '/',
      sameSite: 'lax' as const,
    },
    passport: {
      user: {
        idToken: parsedIdToken,
        refreshToken,
        accessToken,
        authSource: 'prisoner-auth' as const,
        name: parsedIdToken.name,
        token: idToken,
        username: parsedIdToken.name,
        userId: parsedIdToken.sub,
        displayName: parsedIdToken.name,
        userRoles: [] as string[],
      },
    },
  }

  await redisClient.connect()
  await redisClient.set(`sess:${sid}`, JSON.stringify(sessionValue), { EX: 60 * 60 })
  await redisClient.quit()

  return {
    name: 'connect.sid',
    value: encodeURIComponent(`s:${signCookie(sid, sessionSecret)}`),
    url: baseUrl,
    expires: -1,
    httpOnly: true,
    secure: false,
    sameSite: 'Lax' as const,
  }
}

export const test = base.extend({
  context: async ({ browser, baseURL }, use) => {
    const authCookie = await createAuthenticatedCookie(baseURL || 'http://localhost:3000')
    const context = await browser.newContext()
    await context.addCookies([authCookie])
    await use(context)
    await context.close()
  },
  page: async ({ context }, use) => {
    const page = await context.newPage()
    await use(page)
  },
})

export { expect }
