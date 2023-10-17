import { IdToken } from '../launchpad'

export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    passport: {
      user: User
    }
  }
}

export declare global {
  namespace Express {
    interface User {
      refreshToken: string
      idToken: IdToken
      accessToken: string
      token: string
    }

    interface Request {
      user: User
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
    }
  }
}
