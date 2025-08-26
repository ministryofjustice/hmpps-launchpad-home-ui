import { formatDate } from 'date-fns'
import { ApiConfig } from '../../../config'
import { DateFormats } from '../../../constants/date'
import RestClient from '../../restClient'
import PrisonApiClientApiClient from './client'
import { ScheduledEvent } from '../../../@types/prisonApiTypes'
import { PrisonerEvent } from '../../../@types/launchpad'

jest.mock('../../restClient')

const mockBookingId = 'bookingId'
const mockAgencyId = 'agencyId'
const mockPrisonerId = 'prisonerId'

describe('PrisonApiClient', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let prisonApiClient: jest.Mocked<PrisonApiClientApiClient>

  beforeEach(() => {
    const name = 'prisonApiClient'
    const config = {} as ApiConfig
    const token = 'token'

    mockRestClient = new RestClient(name, config, token) as jest.Mocked<RestClient>
    prisonApiClient = new PrisonApiClientApiClient(null) as jest.Mocked<PrisonApiClientApiClient>
    prisonApiClient.restClient = mockRestClient
  })

  afterEach(() => jest.clearAllMocks())

  describe('getBalances', () => {
    it('should retrieve account balances for a specific booking using the correct API endpoint', async () => {
      const mockResponse = true
      ;(mockRestClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const response = await prisonApiClient.getBalances(mockBookingId, mockPrisonerId, mockAgencyId)

      expect(mockRestClient.get).toHaveBeenCalledWith(
        {
          path: `/api/bookings/${mockBookingId}/balances`,
        },
        mockPrisonerId,
        mockAgencyId,
      )
      expect(response).toEqual(mockResponse)
    })
  })

  describe('getDamageObligations', () => {
    it('should retrieve damage obligations for a specific prisoner using the correct API endpoint', async () => {
      const mockResponse = true
      ;(mockRestClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const response = await prisonApiClient.getDamageObligations(mockPrisonerId, mockAgencyId)

      expect(mockRestClient.get).toHaveBeenCalledWith(
        {
          path: `/api/offenders/${mockPrisonerId}/damage-obligations`,
        },
        mockPrisonerId,
        mockAgencyId,
      )
      expect(response).toEqual(mockResponse)
    })
  })

  describe('getPrisonsByAgencyType', () => {
    it('should retrieve a list of prisons filtered by agency type using the correct API endpoint', async () => {
      const mockResponse = true
      ;(mockRestClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const type = 'type'
      const response = await prisonApiClient.getPrisonsByAgencyType(type, mockPrisonerId, mockAgencyId)

      expect(mockRestClient.get).toHaveBeenCalledWith(
        {
          path: `/api/agencies/type/${type}`,
        },
        mockPrisonerId,
        mockAgencyId,
      )
      expect(response).toEqual(mockResponse)
    })
  })

  describe('getTransactionsForDateRange', () => {
    it('should retrieve transaction history for a prisoner within a specific date range using the correct API endpoint', async () => {
      const mockResponse = true
      ;(mockRestClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const accountCode = 'accountCode'
      const fromDate = new Date()
      const toDate = new Date()
      const response = await prisonApiClient.getTransactionsForDateRange(
        mockPrisonerId,
        accountCode,
        fromDate,
        toDate,
        mockAgencyId,
      )

      expect(mockRestClient.get).toHaveBeenCalledWith(
        {
          path: `/api/offenders/${mockPrisonerId}/transaction-history?account_code=${accountCode}&from_date=${formatDate(fromDate, DateFormats.ISO_DATE)}&to_date=${formatDate(toDate, DateFormats.ISO_DATE)}`,
        },
        mockPrisonerId,
        mockAgencyId,
      )
      expect(response).toEqual(mockResponse)
    })
  })

  describe('getVisitBalances', () => {
    it('should fetch visit balances for a specific prisoner using the correct API endpoint', async () => {
      const mockResponse = true
      ;(mockRestClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const response = await prisonApiClient.getVisitBalances(mockPrisonerId, mockAgencyId)

      expect(mockRestClient.get).toHaveBeenCalledWith(
        {
          path: `/api/bookings/offenderNo/${mockPrisonerId}/visit/balances`,
        },
        mockPrisonerId,
        mockAgencyId,
      )
      expect(response).toEqual(mockResponse)
    })
  })

  describe('getEventsSummary', () => {
    it('Should return correct description for Activities', async () => {
      const mockResponse = [
        {
          startTime: `${new Date().toISOString().split('T')[0]}T08:50:00`,
          endTime: `${new Date().toISOString().split('T')[0]}T10:20:00`,
          eventSubType: 'PA',
          eventSourceDesc: 'Description Activities',
          eventSubTypeDesc: 'Description Appointments',
          eventLocation: 'A Wing',
        },
      ] as ScheduledEvent[]
      ;(mockRestClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const response = await prisonApiClient.getEventsSummary(mockBookingId, 'en', mockPrisonerId, mockAgencyId)

      expect(mockRestClient.get).toHaveBeenCalledWith(
        {
          path: `/api/bookings/${mockBookingId}/events/today`,
          query: 'activeRestrictionsOnly=true',
        },
        mockPrisonerId,
        mockAgencyId,
      )
      expect(response.prisonerEvents[0].description).toEqual('Description Activities')
    })

    it('Should return correct description for Appointments', async () => {
      const mockResponse = [
        {
          startTime: `${new Date().toISOString().split('T')[0]}T15:10:00`,
          endTime: `${new Date().toISOString().split('T')[0]}T16:40:00`,
          eventSubType: 'APP',
          eventSourceDesc: 'Do not show',
          eventSubTypeDesc: 'Description Appointments',
          eventLocation: 'A Wing',
        },
      ] as ScheduledEvent[]
      ;(mockRestClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const response = await prisonApiClient.getEventsSummary(mockBookingId, 'en', mockPrisonerId, mockAgencyId)

      expect(mockRestClient.get).toHaveBeenCalledWith(
        {
          path: `/api/bookings/${mockBookingId}/events/today`,
          query: 'activeRestrictionsOnly=true',
        },
        mockPrisonerId,
        mockAgencyId,
      )
      expect(response.prisonerEvents[0].description).toEqual('Description Appointments')
    })
  })
})
