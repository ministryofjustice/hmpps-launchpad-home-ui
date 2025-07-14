import logger from '../../../../logger'
import {
  HasAdjudicationsResponse,
  PageReportedAdjudicationDto,
  ReportedAdjudicationApiResponse,
} from '../../../@types/adjudicationsApiTypes'
import config, { ApiConfig } from '../../../config'
import RestClient from '../../restClient'

export default class AdjudicationsApiClient {
  public restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('adjudicationsApiClient', config.apis.adjudications as ApiConfig, token)
  }

  async hasAdjudications(bookingId: string, agencyId: string, prisonerId: string): Promise<HasAdjudicationsResponse> {
    try {
      return await this.restClient.get({
        path: `/adjudications/booking/${bookingId}/exists`,
        headers: {
          'Active-Caseload': agencyId,
        },
      })
    } catch (error) {
      logger.error(`Error fetching adjudications for bookingId: ${bookingId}, agencyId: ${agencyId}`, {
        prisonerId,
        agencyId,
        error,
      })
      return { hasAdjudications: false }
    }
  }

  async getReportedAdjudicationsFor(
    bookingId: string,
    agencyId: string,
    status: string,
    prisonerId: string,
  ): Promise<PageReportedAdjudicationDto> {
    try {
      return await this.restClient.get({
        path: `/reported-adjudications/booking/${bookingId}?agency=${agencyId}${status}&size=50`,
        headers: {
          'Active-Caseload': agencyId,
        },
      })
    } catch (error) {
      logger.error(`Error fetching reported adjudications for bookingId: ${bookingId}, agencyId: ${agencyId}`, {
        prisonerId,
        agencyId,
        error,
      })
      return null
    }
  }

  async getReportedAdjudication(
    chargeNumber: string,
    agencyId: string,
    prisonerId: string,
  ): Promise<ReportedAdjudicationApiResponse> {
    try {
      return await this.restClient.get({
        path: `/reported-adjudications/${chargeNumber}/v2`,
        headers: {
          'Active-Caseload': agencyId,
        },
      })
    } catch (error) {
      logger.error(`Error fetching adjudication for chargeNumber: ${chargeNumber}, agencyId: ${agencyId}`, {
        prisonerId,
        agencyId,
        error,
      })
      return { reportedAdjudication: null }
    }
  }
}
