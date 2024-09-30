import { format } from 'date-fns'

import { ADJUDICATION_STATUSES } from '../../constants/adjudications'
import { DateFormats } from '../../constants/date'
import { AdjudicationsApiClient, HmppsAuthClient, RestClientBuilder } from '../../data'

export default class AdjudicationsService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly adjudicationsApiClientFactory: RestClientBuilder<AdjudicationsApiClient>,
  ) {}

  async hasAdjudications(bookingId: string, prisonId: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const adjudicationsApiClient = this.adjudicationsApiClientFactory(token)
    return adjudicationsApiClient.hasAdjudications(bookingId, prisonId)
  }

  async getReportedAdjudicationsFor(bookingId: string, prisonId: string) {
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

  async getReportedAdjudication(chargeNumber: string, agencyId: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const adjudicationsApiClient = this.adjudicationsApiClientFactory(token)

    return adjudicationsApiClient.getReportedAdjudication(chargeNumber, agencyId)
  }
}
