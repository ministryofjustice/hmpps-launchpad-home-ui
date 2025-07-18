import { Readable } from 'stream'

import Agent, { HttpsAgent } from 'agentkeepalive'
import superagent from 'superagent'

import logger from '../../logger'
import type { ApiConfig } from '../config'
import type { UnsanitisedError } from '../sanitisedError'
import sanitiseError from '../sanitisedError'
import { formatLogMessage } from '../utils/utils'

interface Request {
  path: string
  query?: object | string
  headers?: Record<string, string>
  responseType?: string
  raw?: boolean
}

interface RequestWithBody extends Request {
  data?: Record<string, unknown>
  retry?: boolean
}

interface StreamRequest {
  path?: string
  headers?: Record<string, string>
  errorLogger?: (e: UnsanitisedError) => void
}

export default class RestClient {
  agent: Agent

  constructor(
    private readonly name: string,
    private readonly config: ApiConfig,
    private readonly token: string,
  ) {
    this.agent = config.url.startsWith('https') ? new HttpsAgent(config.agent) : new Agent(config.agent)
  }

  private apiUrl() {
    return this.config.url
  }

  private timeoutConfig() {
    return this.config.timeout
  }

  async get<Response = unknown>(
    { path, query = {}, headers = {}, responseType = '', raw = false }: Request,
    prisonerId?: string,
    agencyId?: string,
  ): Promise<Response> {
    logger.info(formatLogMessage(`${this.name} GET: ${path}`, prisonerId, agencyId))
    try {
      const result = await superagent
        .get(`${this.apiUrl()}${path}`)
        .query(query)
        .agent(this.agent)
        .retry(2, (err, res) => {
          if (err)
            logger.info(
              formatLogMessage(
                `Retry handler found ${this.name} API error with ${err.code} ${err.message}`,
                prisonerId,
                agencyId,
              ),
            )
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(this.token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      return raw ? (result as Response) : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn(
        { ...sanitisedError, prisonerId, agencyId },
        `Error calling ${this.name}, path: '${path}', verb: 'GET'`,
      )
      throw sanitisedError
    }
  }

  private async requestWithBody<Response = unknown>(
    method: 'patch' | 'post' | 'put',
    { path, query = {}, headers = {}, responseType = '', data = {}, raw = false, retry = false }: RequestWithBody,
    prisonerId?: string,
    agencyId?: string,
  ): Promise<Response> {
    logger.info(formatLogMessage(`${this.name} ${method.toUpperCase()}: ${path}`, prisonerId, agencyId))
    try {
      const result = await superagent[method](`${this.apiUrl()}${path}`)
        .query(query)
        .send(data)
        .agent(this.agent)
        .retry(2, (err, res) => {
          if (retry === false) {
            return false
          }
          if (err)
            logger.info(
              formatLogMessage(`Retry handler found API error with ${err.code} ${err.message}`, prisonerId, agencyId),
            )
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(this.token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      return raw ? (result as Response) : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn(
        { ...sanitisedError, prisonerId, agencyId },
        `Error calling ${this.name}, path: '${path}', verb: '${method.toUpperCase()}'`,
      )
      throw sanitisedError
    }
  }

  async patch<Response = unknown>(request: RequestWithBody, prisonerId?: string, agencyId?: string): Promise<Response> {
    return this.requestWithBody('patch', request, prisonerId, agencyId)
  }

  async post<Response = unknown>(request: RequestWithBody, prisonerId?: string, agencyId?: string): Promise<Response> {
    return this.requestWithBody('post', request, prisonerId, agencyId)
  }

  async put<Response = unknown>(request: RequestWithBody, prisonerId?: string, agencyId?: string): Promise<Response> {
    return this.requestWithBody('put', request, prisonerId, agencyId)
  }

  async delete<Response = unknown>(
    { path, query = {}, headers = {}, responseType = '', raw = false }: Request,
    prisonerId?: string,
    agencyId?: string,
  ): Promise<Response> {
    logger.info(formatLogMessage(`${this.name} DELETE: ${path}`, prisonerId, agencyId))
    try {
      const result = await superagent
        .delete(`${this.apiUrl()}${path}`)
        .query(query)
        .agent(this.agent)
        .retry(2, (err, res) => {
          if (err)
            logger.info(
              formatLogMessage(
                `Retry handler found ${this.name} API error with ${err.code} ${err.message}`,
                prisonerId,
                agencyId,
              ),
            )
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(this.token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      return raw ? (result as Response) : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn(
        { ...sanitisedError, prisonerId, agencyId },
        `Error calling ${this.name}, path: '${path}', verb: 'DELETE'`,
      )
      throw sanitisedError
    }
  }

  async stream(
    { path = null, headers = {} }: StreamRequest = {},
    prisonerId?: string,
    agencyId?: string,
  ): Promise<Readable> {
    logger.info(formatLogMessage(`${this.name} streaming: ${path}`, prisonerId, agencyId))
    return new Promise((resolve, reject) => {
      superagent
        .get(`${this.apiUrl()}${path}`)
        .agent(this.agent)
        .auth(this.token, { type: 'bearer' })
        .retry(2, (err, res) => {
          if (err)
            logger.info(
              formatLogMessage(
                `Retry handler found ${this.name} API error with ${err.code} ${err.message}`,
                prisonerId,
                agencyId,
              ),
            )
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .timeout(this.timeoutConfig())
        .set(headers)
        .end((error, response) => {
          if (error) {
            logger.warn({ ...sanitiseError(error), prisonerId, agencyId }, `Error calling ${this.name}`)
            reject(error)
          } else if (response) {
            const s = new Readable()
            // eslint-disable-next-line no-underscore-dangle
            s._read = () => {}
            s.push(response.body)
            s.push(null)
            resolve(s)
          }
        })
    })
  }
}
