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

  async hasAdjudications(bookingId: string, agencyId: string): Promise<HasAdjudicationsResponse> {
    return (await this.restClient.get({
      path: `/adjudications/booking/${bookingId}/exists`,
      headers: {
        'Active-Caseload': agencyId,
      },
    })) as HasAdjudicationsResponse
  }

  async getReportedAdjudicationsFor(
    bookingId: string,
    agencyId: string,
    status: string,
  ): Promise<PageReportedAdjudicationDto> {
    return (await this.restClient.get({
      path: `/reported-adjudications/booking/${bookingId}?agency=${agencyId}${status}`,
      headers: {
        'Active-Caseload': agencyId,
      },
    })) as PageReportedAdjudicationDto
  }

  async getReportedAdjudication(chargeNumber: string, agencyId: string): Promise<ReportedAdjudicationApiResponse> {
    return (await this.restClient.get({
      path: `/reported-adjudications/${chargeNumber}/v2`,
      headers: {
        'Active-Caseload': agencyId,
      },
    })) as ReportedAdjudicationApiResponse
  }
}
