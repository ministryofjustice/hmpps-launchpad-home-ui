import superagent from 'superagent'

export class WiremockUtils {
  readonly host: string

  readonly url: string

  constructor(baseUrl = process.env.WIREMOCK_BASE_URL || 'http://localhost:9091') {
    const normalisedBaseUrl = (baseUrl || 'http://localhost:9091').replace(/\/$/, '')
    this.host = normalisedBaseUrl
      .replace(/^http:\/\/localhost(?=[:/]|$)/, 'http://127.0.0.1')
      .replace(/^https:\/\/localhost(?=[:/]|$)/, 'https://127.0.0.1')
    this.url = `${this.host}/__admin`
    // eslint-disable-next-line no-console
    console.log(`wiremock url: ${this.url}`)
  }

  stubFor(mapping: Record<string, unknown>): Promise<superagent.Response> {
    return superagent.post(`${this.url}/mappings`).send(mapping)
  }

  getMatchingRequests(body: string | Record<string, unknown>): Promise<superagent.Response> {
    return superagent.post(`${this.url}/requests/find`).send(body)
  }

  async reset(): Promise<void> {
    await Promise.all([superagent.delete(`${this.url}/mappings`), superagent.delete(`${this.url}/requests`)])
  }
}

const wiremockUtils = new WiremockUtils()

const stubFor = (mapping: Record<string, unknown>) => wiremockUtils.stubFor(mapping)
const getMatchingRequests = (body: string | Record<string, unknown>) => wiremockUtils.getMatchingRequests(body)
const resetStubs = () => wiremockUtils.reset()

export { stubFor, getMatchingRequests, resetStubs }
export default wiremockUtils
