import { format } from 'date-fns'

import logger from '../../../logger'
import {
  HasAdjudicationsResponse,
  PageReportedAdjudicationDto,
  ReportedAdjudicationApiResponse,
} from '../../@types/adjudicationsApiTypes'
import { IncentiveReviewSummary } from '../../@types/incentivesApiTypes'
import { EventsData, TimetableEvents, TimetableRow } from '../../@types/launchpad'
import { Location, UserDetail } from '../../@types/prisonApiTypes'
import { ADJUDICATION_STATUSES } from '../../constants/adjudications'
import { DateFormats } from '../../constants/date'
import {
  AdjudicationsApiClient,
  HmppsAuthClient,
  IncentivesApiClient,
  PrisonApiClient,
  PrisonerContactRegistryApiClient,
  RestClientBuilder,
} from '../../data'
import Timetable from '../../data/timetable'

export default class PrisonerProfileService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonApiClientFactory: RestClientBuilder<PrisonApiClient>,
    private readonly incentivesApiClientFactory: RestClientBuilder<IncentivesApiClient>,
    private readonly adjudicationsApiClientFactory: RestClientBuilder<AdjudicationsApiClient>,
    private readonly prisonerContactRegistryApiClientFactory: RestClientBuilder<PrisonerContactRegistryApiClient>,
  ) {}

  async getPrisonerEventsSummary(user: { idToken: { booking: { id: string } } }): Promise<EventsData> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)
    const eventsSummary = await prisonApiClient.getEventsSummary(user.idToken.booking.id)
    return eventsSummary
  }

  async getEventsFor(
    user: { idToken: { booking: { id: string } } },
    fromDate: Date,
    toDate: Date,
  ): Promise<TimetableEvents> {
    const token = await this.hmppsAuthClient.getSystemClientToken() // dont do this on every request - do it once and store it in session
    const prisonApiClient = this.prisonApiClientFactory(token)
    const eventsData = await prisonApiClient.getEventsFor(user.idToken.booking.id, fromDate, toDate)
    const timetableData = Timetable.create({ fromDate, toDate }).addEvents(eventsData).build()

    return timetableData.events
  }

  async getEventsForToday(
    user: { idToken: { booking: { id: string } } },
    today: Date = new Date(),
  ): Promise<TimetableRow> {
    const results = await this.getEventsFor(user, today, today)
    return results[format(today, DateFormats.ISO_DATE)]
  }

  async getIncentivesSummaryFor(user: { idToken: { booking: { id: string } } }): Promise<IncentiveReviewSummary> {
    const token = await this.hmppsAuthClient.getSystemClientToken() // dont do this on every request - do it once and store it in session
    const incentivesApiClient = this.incentivesApiClientFactory(token)
    const incentivesData = await incentivesApiClient.getIncentivesSummaryFor(user.idToken.booking.id)

    return incentivesData
  }

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

  async getReportedAdjudicationsFor(user: {
    idToken: { booking: { id: string }; establishment: { agency_id: string } }
  }): Promise<PageReportedAdjudicationDto> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const adjudicationsApiClient = this.adjudicationsApiClientFactory(token)

    const statusQueryParam = ADJUDICATION_STATUSES.map(status => `&status=${status}`).join('')

    const reportedAdjudicationsData = await adjudicationsApiClient.getReportedAdjudicationsFor(
      user.idToken.booking.id,
      user.idToken.establishment.agency_id,
      statusQueryParam,
    )

    const formattedAdjudications = reportedAdjudicationsData.content.map(adjudication => ({
      ...adjudication,
      createdDateTime: format(adjudication.createdDateTime, DateFormats.GDS_PRETTY_DATE_TIME),
    }))

    return {
      ...reportedAdjudicationsData,
      content: formattedAdjudications,
    }
  }

  async getReportedAdjudication(chargeNumber: string, agencyId: string): Promise<ReportedAdjudicationApiResponse> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const adjudicationsApiClient = this.adjudicationsApiClientFactory(token)

    return adjudicationsApiClient.getReportedAdjudication(chargeNumber, agencyId)
  }

  async getUserByUserId(userId: string): Promise<UserDetail> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)
    const user = await prisonApiClient.getUserByUserId(userId)
    return user as UserDetail
  }

  async getLocationByLocationId(locationId: number): Promise<Location> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)
    const location = await prisonApiClient.getLocationByLocationId(locationId)
    return location as Location
  }

  async getTransactions(user: { idToken: { sub: string } }, accountCode: string, fromDate: Date, toDate: Date) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return prisonApiClient.getTransactionsForDateRange(user.idToken.sub, accountCode, fromDate, toDate)
    } catch (e) {
      logger.error('Failed to get transactions for user', e)
      logger.debug(e.stack)
      return null
    }
  }

  async getBalances(bookingId: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return prisonApiClient.getBalances(bookingId)
    } catch (e) {
      logger.error('Failed to get balances for booking', e)
      logger.debug(e.stack)
      return null
    }
  }

  async getPrisonsByAgencyType(type: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return prisonApiClient.getPrisonsByAgencyType(type)
    } catch (e) {
      logger.error('Failed to get prisons by type', e)
      logger.debug(e.stack)
      return null
    }
  }

  async getDamageObligations(user: { idToken: { sub: string } }) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return prisonApiClient.getDamageObligations(user.idToken.sub)
    } catch (e) {
      logger.error('Failed to get damage obligations for user', e)
      logger.debug(e.stack)
      return null
    }
  }

  async getSocialVisitors(prisonerId: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonerContactRegistryApiClient = this.prisonerContactRegistryApiClientFactory(token)

    try {
      return prisonerContactRegistryApiClient.getSocialVisitors(prisonerId)
    } catch (e) {
      logger.error('Failed to get social visitors for user', e)
      logger.debug(e.stack)
      return null
    }
  }

  async getNextVisit(bookingId: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const prisonApiClient = this.prisonApiClientFactory(token)

    try {
      return prisonApiClient.getNextVisit(bookingId)
    } catch (e) {
      logger.error('Failed to get next social visitor for user', e)
      logger.debug(e.stack)
      return null
    }
  }
}
