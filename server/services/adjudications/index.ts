import { format, Locale } from 'date-fns'
import { cy, enGB } from 'date-fns/locale'

import logger from '../../../logger'
import { ADJUDICATION_STATUSES } from '../../constants/adjudications'
import { DateFormats } from '../../constants/date'
import { AdjudicationsApiClient, HmppsAuthClient, RestClientBuilder } from '../../data'
import { formatLogMessage } from '../../utils/utils'

export default class AdjudicationsService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly adjudicationsApiClientFactory: RestClientBuilder<AdjudicationsApiClient>,
  ) {}

  async hasAdjudications(bookingId: string, agencyId: string, prisonerId: string) {
    logger.info(
      formatLogMessage(
        `Fetching adjudications for bookingId: ${bookingId}, agencyId: ${agencyId}`,
        prisonerId,
        agencyId,
      ),
    )
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const adjudicationsApiClient = this.adjudicationsApiClientFactory(token)

    return adjudicationsApiClient.hasAdjudications(bookingId, agencyId, prisonerId)
  }

  async getReportedAdjudicationsFor(bookingId: string, agencyId: string, language: string, prisonerId: string) {
    try {
      logger.info(
        formatLogMessage(
          `Fetching reported adjudications for bookingId: ${bookingId}, agencyId: ${agencyId}`,
          prisonerId,
          agencyId,
        ),
      )
      const token = await this.hmppsAuthClient.getSystemClientToken()
      const adjudicationsApiClient = this.adjudicationsApiClientFactory(token)

      const statusQueryParam = ADJUDICATION_STATUSES.map(status => `&status=${status}`).join('')

      const { content, ...rest } = await adjudicationsApiClient.getReportedAdjudicationsFor(
        bookingId,
        agencyId,
        statusQueryParam,
        prisonerId,
      )

      logger.info(
        formatLogMessage(
          `Formatting reported adjudications for bookingId: ${bookingId}, agencyId: ${agencyId}`,
          prisonerId,
          agencyId,
        ),
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
      logger.error(
        formatLogMessage(
          `Error fetching reported adjudications for bookingId: ${bookingId}, agencyId: ${agencyId}`,
          prisonerId,
          agencyId,
        ),
        error,
      )
      throw new Error('Failed to fetch reported adjudications')
    }
  }

  async getReportedAdjudication(chargeNumber: string, agencyId: string, prisonerId: string) {
    logger.info(
      formatLogMessage(
        `Fetching adjudication for chargeNumber: ${chargeNumber}, agencyId: ${agencyId}`,
        prisonerId,
        agencyId,
      ),
    )

    const token = await this.hmppsAuthClient.getSystemClientToken()
    const adjudicationsApiClient = this.adjudicationsApiClientFactory(token)

    return adjudicationsApiClient.getReportedAdjudication(chargeNumber, agencyId, prisonerId)
  }
}
