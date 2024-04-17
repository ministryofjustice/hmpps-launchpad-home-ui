import { format } from 'date-fns'
import {
  HasAdjudicationsResponse,
  PageReportedAdjudicationDto,
  ReportedAdjudicationApiResponse,
} from '../@types/adjudicationsApiTypes'
import { IncentiveReviewSummary } from '../@types/incentivesApiTypes'
import { EventsData, TimetableEvents, TimetableRow } from '../@types/launchpad'
import { ADJUDICATION_STATUSES } from '../constants/adjudications'
import {
  AdjudicationsApiClient,
  HmppsAuthClient,
  IncentivesApiClient,
  PrisonApiClient,
  RestClientBuilder,
} from '../data'
import Timetable from '../data/timetable'
import { DateFormats } from '../utils/enums'
import { Location, UserDetail } from '../@types/prisonApiTypes'

export default class PrisonerProfileService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonApiClientFactory: RestClientBuilder<PrisonApiClient>,
    private readonly incentivesApiClientFactory: RestClientBuilder<IncentivesApiClient>,
    private readonly adjudicationsApiClientFactory: RestClientBuilder<AdjudicationsApiClient>,
  ) {}

  private async getToken() {
    return this.hmppsAuthClient.getSystemClientToken()
  }

  async getPrisonerEventsSummary(user: { idToken: { booking: { id: string } } }): Promise<EventsData> {
    const token = await this.getToken()
    const prisonApiClient = this.prisonApiClientFactory(token)
    const eventsSummary = await prisonApiClient.getEventsSummary(user.idToken.booking.id)
    return eventsSummary
  }

  async getEventsFor(
    user: { idToken: { booking: { id: string } } },
    fromDate: Date,
    toDate: Date,
  ): Promise<TimetableEvents> {
    const token = await this.getToken()
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
    const token = await this.getToken()
    const incentivesApiClient = this.incentivesApiClientFactory(token)
    const incentivesData = await incentivesApiClient.getIncentivesSummaryFor(user.idToken.booking.id)

    return incentivesData
  }

  async hasAdjudications(user: {
    idToken: { booking: { id: string }; establishment: { agency_id: string } }
  }): Promise<HasAdjudicationsResponse> {
    const token = await this.getToken()
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
    const token = await this.getToken()
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
    const token = await this.getToken()
    const adjudicationsApiClient = this.adjudicationsApiClientFactory(token)

    return adjudicationsApiClient.getReportedAdjudication(chargeNumber, agencyId)
  }

  async getUserByUserId(userId: string): Promise<UserDetail> {
    const token = await this.getToken()
    const prisonApiClient = this.prisonApiClientFactory(token)
    const user = await prisonApiClient.getUserByUserId(userId)
    return user as UserDetail
  }

  async getLocationByLocationId(locationId: number): Promise<Location> {
    const token = await this.getToken()
    const prisonApiClient = this.prisonApiClientFactory(token)
    const location = await prisonApiClient.getLocationByLocationId(locationId)
    return location as Location
  }
}
