import { Request, Response, NextFunction } from 'express'

// eslint-disable-next-line import/prefer-default-export
export const asyncHandler =
  <T extends (...args: unknown[]) => Promise<unknown>>(fn: T) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res)
    } catch (err) {
      next(err)
    }
  }
