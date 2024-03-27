import { HasAdjudicationsResponse, PageReportedAdjudicationDto } from '../@types/adjudicationsApiTypes'
import RestClient from './restClient'
import config, { ApiConfig } from '../config'

export default class AdjudicationsApiClient {
  private restClient: RestClient

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
}
