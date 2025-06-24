import { format, Locale } from 'date-fns'
import { cy, enGB } from 'date-fns/locale'

import logger from '../../../logger'
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

  async getReportedAdjudicationsFor(bookingId: string, prisonId: string, language: string) {
    try {
      const token = await this.hmppsAuthClient.getSystemClientToken()
      const adjudicationsApiClient = this.adjudicationsApiClientFactory(token)

      const statusQueryParam = ADJUDICATION_STATUSES.map(status => `&status=${status}`).join('')

      const { content, ...rest } = await adjudicationsApiClient.getReportedAdjudicationsFor(
        bookingId,
        prisonId,
        statusQueryParam,
      )

      const locales: Record<string, Locale> = { en: enGB, cy }
      const locale = locales[language] || enGB

      const formattedContent = content.map(adjudication => ({
        ...adjudication,
        createdDateTime: format(new Date(adjudication.createdDateTime), DateFormats.GDS_PRETTY_DATE_TIME, { locale }),
      }))

      return {
        ...rest,
        content: formattedContent,
      }
    } catch (error) {
      logger.error(`Error fetching reported adjudications for bookingId: ${bookingId}, prisonId: ${prisonId}`, error)
      throw new Error('Failed to fetch reported adjudications')
    }
  }

  async getReportedAdjudication(chargeNumber: string, agencyId: string, prisonerId: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const adjudicationsApiClient = this.adjudicationsApiClientFactory(token)

    const result = await adjudicationsApiClient.getReportedAdjudication(chargeNumber, agencyId)

    if (result.reportedAdjudication?.prisonerNumber === prisonerId) {
      return result
    }
    throw new Error('Failed to fetch reported adjudication')
  }
}
