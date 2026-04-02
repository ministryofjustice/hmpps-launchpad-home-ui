import { LaunchpadUser } from '@ministryofjustice/hmpps-prisoner-auth'
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
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends LaunchpadUser {}

    interface Request {
      user: User
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
    }

    interface Locals extends LaunchpadHeaderLocals, LaunchpadFooterLocals {}
  }
}
