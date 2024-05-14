import { Request, Response, NextFunction } from 'express'

export const asyncHandler =
  <T extends (...args: unknown[]) => Promise<unknown>>(fn: T) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res)
    } catch (err) {
      next(err)
    }
  }
