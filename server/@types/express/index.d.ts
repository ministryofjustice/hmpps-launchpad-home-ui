import { IdToken, RefreshToken } from '../launchpad'

export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
  }
}

export declare global {
  namespace Express {
    interface User {
      refreshToken: RefreshToken
      idToken: IdToken
      accessToken: string
      token: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
      user: User
    }
  }
}
