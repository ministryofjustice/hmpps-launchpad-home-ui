import { formatDate } from 'date-fns'
import i18next from 'i18next'

import { EventsData, PrisonerEvent } from '../../../@types/launchpad'
import {
  Account,
  Agency,
  OffenderDamageObligation,
  OffenderTransactionHistoryDto,
  ScheduledEvent,
  UserDetail,
  VisitBalances,
  VisitDetails,
} from '../../../@types/prisonApiTypes'

import logger from '../../../../logger'
import config, { ApiConfig } from '../../../config'
import { DateFormats } from '../../../constants/date'
import { convertLocation, convertToTitleCase, formatLogMessage } from '../../../utils/utils'
import RestClient from '../../restClient'

export default class PrisonApiClient {
  public restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('prisonApiClient', config.apis.prison as ApiConfig, token)
  }

  async getEventsSummary(
    bookingId: string,
    language: string,
    prisonerId: string,
    agencyId: string,
  ): Promise<EventsData> {
    try {
      const scheduledEvents: ScheduledEvent[] = await this.restClient.get({
        path: `/api/bookings/${bookingId}/events/today`,
        query: new URLSearchParams({ activeRestrictionsOnly: 'true' }).toString(),
      })

      logger.info(formatLogMessage(`Formatting events summary for bookingId: ${bookingId}`, prisonerId, agencyId))
      const prisonerEvents: PrisonerEvent[] = []
      scheduledEvents.forEach(scheduledEvent => {
        const dateTimeFormat = DateFormats.PRETTY_TIME

        const formattedFrom = scheduledEvent.startTime
          ? formatDate(new Date(scheduledEvent.startTime), dateTimeFormat)
          : 'N/A'
        const formattedTo = scheduledEvent.endTime
          ? formatDate(new Date(scheduledEvent.endTime), dateTimeFormat)
          : 'N/A'
        const timeString = `${formattedFrom} ${i18next.t('timetable.timeRange', { lng: language })} ${formattedTo}`

        const prisonerEvent: PrisonerEvent = {
          timeString,
          description: convertToTitleCase(scheduledEvent.eventSourceDesc),
          location: convertToTitleCase(convertLocation(scheduledEvent.eventLocation)),
        }
        prisonerEvents.push(prisonerEvent)
      })

      return { isTomorrow: false, error: false, prisonerEvents }
    } catch (error) {
      logger.error(
        formatLogMessage(`Error fetching events summary for bookingId: ${bookingId}`, prisonerId, agencyId),
        error,
      )
      throw new Error('Failed to fetch events summary')
    }
  }

  async getEventsFor(
    bookingId: string,
    fromDate: Date,
    toDate: Date,
    prisonerId: string,
    agencyId: string,
  ): Promise<ScheduledEvent[]> {
    try {
      return await this.restClient.get({
        path: `/api/bookings/${bookingId}/events`,
        query: new URLSearchParams({
          fromDate: formatDate(fromDate, DateFormats.ISO_DATE),
          toDate: formatDate(toDate, DateFormats.ISO_DATE),
        }).toString(),
      })
    } catch (error) {
      logger.error(
        formatLogMessage(
          `Error fetching events for bookingId: ${bookingId} from ${fromDate} to ${toDate}`,
          prisonerId,
          agencyId,
        ),
        error,
      )
      throw new Error('Failed to fetch events data')
    }
  }

  async getUserById(userId: string, prisonerId: string, agencyId: string): Promise<UserDetail> {
    try {
      return await this.restClient.get({
        path: `/api/users/${userId}`,
      })
    } catch (error) {
      logger.error(formatLogMessage(`Error fetching user for userId: ${userId}`, prisonerId, agencyId), error)
      throw new Error('Failed to fetch user')
    }
  }

  async getBalances(bookingId: string, prisonerId: string, agencyId: string): Promise<Account> {
    try {
      return await this.restClient.get({
        path: `/api/bookings/${bookingId}/balances`,
      })
    } catch (error) {
      logger.error(
        formatLogMessage(`Error fetching account data for bookingId: ${bookingId}`, prisonerId, agencyId),
        error,
      )
      return {
        spends: null,
        cash: null,
        savings: null,
        damageObligations: null,
        currency: null,
      }
    }
  }

  async getDamageObligations(
    prisonerId: string,
    agencyId: string,
  ): Promise<{ damageObligations: OffenderDamageObligation[] } | null> {
    try {
      return await this.restClient.get({
        path: `/api/offenders/${prisonerId}/damage-obligations`,
      })
    } catch (error) {
      logger.error(
        formatLogMessage(`Error fetching damage obligations for prisonerId: ${prisonerId}`, prisonerId, agencyId),
        error,
      )
      throw new Error('Failed to fetch damage obligations')
    }
  }

  async getPrisonsByAgencyType(type: string, prisonerId: string, agencyId: string): Promise<Agency[] | null> {
    try {
      return await this.restClient.get({
        path: `/api/agencies/type/${type}`,
      })
    } catch (error) {
      logger.error(formatLogMessage(`Error fetching prisons by agency type: ${type}`, prisonerId, agencyId), error)
      throw new Error('Failed to fetch prisons')
    }
  }

  async getTransactionsForDateRange(
    prisonerId: string,
    accountCode: string,
    fromDate: Date,
    toDate: Date,
    agencyId: string,
  ): Promise<OffenderTransactionHistoryDto[] | null> {
    try {
      return await this.restClient.get({
        path: `/api/offenders/${prisonerId}/transaction-history?account_code=${accountCode}&from_date=${formatDate(fromDate, DateFormats.ISO_DATE)}&to_date=${formatDate(toDate, DateFormats.ISO_DATE)}`,
      })
    } catch (error) {
      logger.error(formatLogMessage('Error fetching transactions for prisoner', prisonerId, agencyId), {
        prisonerId,
        accountCode,
        fromDate,
        toDate,
        error,
      })
      throw new Error('Failed to fetch transactions')
    }
  }

  async getNextVisit(bookingId: string, prisonerId: string, agencyId: string): Promise<VisitDetails | null> {
    try {
      return await this.restClient.get({
        path: `/api/bookings/${bookingId}/visits/next?withVisitors=true`,
      })
    } catch (error) {
      logger.error(
        formatLogMessage(`Error fetching next visit for bookingId: ${bookingId}`, prisonerId, agencyId),
        error,
      )
      return null
    }
  }

  async getVisitBalances(prisonerId: string, agencyId: string): Promise<VisitBalances | null> {
    try {
      return await this.restClient.get({
        path: `/api/bookings/offenderNo/${prisonerId}/visit/balances`,
      })
    } catch (error) {
      logger.error(
        formatLogMessage(`Error fetching visit balances for prisonerId: ${prisonerId}`, prisonerId, agencyId),
        error,
      )
      return null
    }
  }
}
