import { format } from 'date-fns'

import {
  HasAdjudicationsResponse,
  PageReportedAdjudicationDto,
  ReportedAdjudicationApiResponse,
} from '../../@types/adjudicationsApiTypes'

import { ADJUDICATION_STATUSES } from '../../constants/adjudications'
import { DateFormats } from '../../constants/date'

import { AdjudicationsApiClient, HmppsAuthClient, RestClientBuilder } from '../../data'

export default class AdjudicationsService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly adjudicationsApiClientFactory: RestClientBuilder<AdjudicationsApiClient>,
  ) {}

  async hasAdjudications(user: {
    idToken: { booking: { id: string }; establishment: { agency_id: string } }
  }): Promise<HasAdjudicationsResponse> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const adjudicationsApiClient = this.adjudicationsApiClientFactory(token)
    const userHasAdjudications = await adjudicationsApiClient.hasAdjudications(
      user.idToken.booking.id,
      user.idToken.establishment.agency_id,
    )

    return userHasAdjudications
  }

  async getReportedAdjudicationsFor(bookingId: string, prisonId: string): Promise<PageReportedAdjudicationDto> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const adjudicationsApiClient = this.adjudicationsApiClientFactory(token)

    const statusQueryParam = ADJUDICATION_STATUSES.map(status => `&status=${status}`).join('')

    const { content, ...rest } = await adjudicationsApiClient.getReportedAdjudicationsFor(
      bookingId,
      prisonId,
      statusQueryParam,
    )

    const formattedContent = content.map(adjudication => ({
      ...adjudication,
      createdDateTime: format(adjudication.createdDateTime, DateFormats.GDS_PRETTY_DATE_TIME),
    }))

    return {
      ...rest,
      content: formattedContent,
    }
  }

  async getReportedAdjudication(chargeNumber: string, agencyId: string): Promise<ReportedAdjudicationApiResponse> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const adjudicationsApiClient = this.adjudicationsApiClientFactory(token)

    return adjudicationsApiClient.getReportedAdjudication(chargeNumber, agencyId)
  }
}
