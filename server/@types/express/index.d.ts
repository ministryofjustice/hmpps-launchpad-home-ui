import { IdToken, LaunchpadUser } from '@ministryofjustice/hmpps-prisoner-auth'
import { LaunchpadFooterLocals, LaunchpadHeaderLocals } from '@ministryofjustice/hmpps-prisoner-facing-components'

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
    type SimplifiedLaunchpadUser = {
      idToken: LaunchpadUser['idToken']
      accessToken: LaunchpadUser['accessToken']
      refreshToken: LaunchpadUser['refreshToken']
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends SimplifiedLaunchpadUser {}

    interface Request {
      user: User
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
    }

    interface Locals extends LaunchpadHeaderLocals, LaunchpadFooterLocals {}
  }
}
