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
      refreshToken: string
      idToken: string
      accessToken: string
      tokenType: string
      expiresIn: string
      token: string
    }

    // interface User {
    //   username: string
    //   token: string
    //   authSource: string
    // }
    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
    }
  }
}
