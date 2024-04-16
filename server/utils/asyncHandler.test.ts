import { Request, Response } from 'express'
import { asyncHandler } from './asyncHandler'

describe(asyncHandler.name, () => {
  it('should call the provided function with req and res', async () => {
    const mockFn = jest.fn().mockResolvedValue(undefined)
    const req = {} as Request
    const res = {} as Response
    const next = jest.fn()

    await asyncHandler(mockFn)(req, res, next)

    expect(mockFn).toHaveBeenCalledWith(req, res)
  })

  it('should call next with an error if the provided function throws', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('Test error'))
    const req = {} as Request
    const res = {} as Response
    const next = jest.fn()

    await asyncHandler(mockFn)(req, res, next)

    expect(next).toHaveBeenCalledWith(new Error('Test error'))
  })

  it('should call next with the error thrown by the provided function', async () => {
    const mockError = new Error('Test error')
    const mockFn = jest.fn().mockRejectedValue(mockError)
    const req = {} as Request
    const res = {} as Response
    const next = jest.fn()

    await asyncHandler(mockFn)(req, res, next)

    expect(next).toHaveBeenCalledWith(mockError)
  })
})
