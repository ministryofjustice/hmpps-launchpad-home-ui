import { formatDate } from 'date-fns'

import { EventsData, PrisonerEvent } from '../../../@types/launchpad'
import {
  Account,
  Agency,
  Location,
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
import { convertToTitleCase } from '../../../utils/utils'
import RestClient from '../../restClient'

export default class PrisonApiClient {
  public restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('prisonApiClient', config.apis.prison as ApiConfig, token)
  }

  async getEventsSummary(bookingId: string): Promise<EventsData> {
    try {
      const scheduledEvents: ScheduledEvent[] = await this.restClient.get({
        path: `/api/bookings/${bookingId}/events/today`,
        query: new URLSearchParams({ activeRestrictionsOnly: 'true' }).toString(),
      })

      const prisonerEvents: PrisonerEvent[] = []
      scheduledEvents.forEach(scheduledEvent => {
        const dateTimeFormat = DateFormats.PRETTY_TIME

        const formattedFrom = scheduledEvent.startTime
          ? formatDate(new Date(scheduledEvent.startTime), dateTimeFormat)
          : 'N/A'
        const formattedTo = scheduledEvent.endTime
          ? formatDate(new Date(scheduledEvent.endTime), dateTimeFormat)
          : 'N/A'
        const timeString = `${formattedFrom} to ${formattedTo}`

        const prisonerEvent: PrisonerEvent = {
          timeString,
          description: convertToTitleCase(scheduledEvent.eventSourceDesc),
          location: convertToTitleCase(scheduledEvent.eventLocation),
        }
        prisonerEvents.push(prisonerEvent)
      })

      return { isTomorrow: false, error: false, prisonerEvents }
    } catch (error) {
      logger.error(`Error fetching events summary for bookingId: ${bookingId}`, error)
      throw new Error('Failed to fetch events summary')
    }
  }

  async getEventsFor(bookingId: string, fromDate: Date, toDate: Date): Promise<ScheduledEvent[]> {
    try {
      return await this.restClient.get({
        path: `/api/bookings/${bookingId}/events`,
        query: new URLSearchParams({
          fromDate: formatDate(fromDate, DateFormats.ISO_DATE),
          toDate: formatDate(toDate, DateFormats.ISO_DATE),
        }).toString(),
      })
    } catch (error) {
      logger.error(`Error fetching events for bookingId: ${bookingId} from ${fromDate} to ${toDate}`, error)
      throw new Error('Failed to fetch events data')
    }
  }

  async getUserById(userId: string): Promise<UserDetail> {
    try {
      return await this.restClient.get({
        path: `/api/users/${userId}`,
      })
    } catch (error) {
      logger.error(`Error fetching user for userId: ${userId}`, error)
      throw new Error('Failed to fetch user')
    }
  }

  async getLocationById(locationId: number): Promise<Location> {
    try {
      return await this.restClient.get({
        path: `/api/locations/${locationId}`,
      })
    } catch (error) {
      logger.error(`Error fetching location for locationId: ${locationId}`, error)
      throw new Error('Failed to fetch location')
    }
  }

  async getBalances(bookingId: string): Promise<Account> {
    try {
      return await this.restClient.get({
        path: `/api/bookings/${bookingId}/balances`,
      })
    } catch (error) {
      logger.error('Error fetching account data:', error)
      return {
        spends: null,
        cash: null,
        savings: null,
        damageObligations: null,
        currency: null,
      }
    }
  }

  async getDamageObligations(prisonerId: string): Promise<{ damageObligations: OffenderDamageObligation[] } | null> {
    try {
      return await this.restClient.get({
        path: `/api/offenders/${prisonerId}/damage-obligations`,
      })
    } catch (error) {
      logger.error('Error fetching damage obligations for prisoner', { prisonerId, error })
      throw new Error('Failed to fetch damage obligations')
    }
  }

  async getPrisonsByAgencyType(type: string): Promise<Agency[] | null> {
    try {
      return await this.restClient.get({
        path: `/api/agencies/type/${type}`,
      })
    } catch (error) {
      logger.error('Error fetching prisons by agency type', { type, error })
      throw new Error('Failed to fetch prisons')
    }
  }

  async getTransactionsForDateRange(
    prisonerId: string,
    accountCode: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<OffenderTransactionHistoryDto[] | null> {
    try {
      return await this.restClient.get({
        path: `/api/offenders/${prisonerId}/transaction-history?account_code=${accountCode}&from_date=${formatDate(fromDate, DateFormats.ISO_DATE)}&to_date=${formatDate(toDate, DateFormats.ISO_DATE)}`,
      })
    } catch (error) {
      logger.error('Error fetching transactions for prisoner', { prisonerId, accountCode, fromDate, toDate, error })
      throw new Error('Failed to fetch transactions')
    }
  }

  async getNextVisit(bookingId: string): Promise<VisitDetails | null> {
    try {
      return await this.restClient.get({
        path: `/api/bookings/${bookingId}/visits/next?withVisitors=true`,
      })
    } catch (error) {
      logger.error(`Error fetching next visit for bookingId: ${bookingId}`, error)
      return null
    }
  }

  async getVisitBalances(prisonerId: string): Promise<VisitBalances | null> {
    try {
      return await this.restClient.get({
        path: `/api/bookings/offenderNo/${prisonerId}/visit/balances`,
      })
    } catch (error) {
      logger.error(`Error fetching visit balances for prisonerId: ${prisonerId}`, error)
      return null
    }
  }
}
