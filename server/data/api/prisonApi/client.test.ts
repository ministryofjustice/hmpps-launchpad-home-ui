import { formatDate } from 'date-fns'
import { ApiConfig } from '../../../config'
import { DateFormats } from '../../../utils/enums'
import PrisonApiClientApiClient from './client'
import RestClient from '../../restClient'

jest.mock('../../restClient')

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
    it('should call restClient.get with correct parameters', async () => {
      const mockResponse = true
      ;(mockRestClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const bookingId = 'bookingId'
      const response = await prisonApiClient.getBalances(bookingId)

      expect(mockRestClient.get).toHaveBeenCalledWith({
        path: `/api/bookings/${bookingId}/balances`,
      })
      expect(response).toEqual(mockResponse)
    })
  })

  describe('getDamageObligations', () => {
    it('should call restClient.get with correct parameters', async () => {
      const mockResponse = true
      ;(mockRestClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const prisonerId = 'prisonerId'
      const response = await prisonApiClient.getDamageObligations(prisonerId)

      expect(mockRestClient.get).toHaveBeenCalledWith({
        path: `/api/offenders/${prisonerId}/damage-obligations`,
      })
      expect(response).toEqual(mockResponse)
    })
  })

  describe('getPrisonsByAgencyType', () => {
    it('should call restClient.get with correct parameters', async () => {
      const mockResponse = true
      ;(mockRestClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const type = 'type'
      const response = await prisonApiClient.getPrisonsByAgencyType(type)

      expect(mockRestClient.get).toHaveBeenCalledWith({
        path: `/api/agencies/type/${type}`,
      })
      expect(response).toEqual(mockResponse)
    })
  })

  describe('getTransactionsForDateRange', () => {
    it('should call restClient.get with correct parameters', async () => {
      const mockResponse = true
      ;(mockRestClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const prisonerId = 'prisonerId'
      const accountCode = 'accountCode'
      const fromDate = new Date()
      const toDate = new Date()
      const response = await prisonApiClient.getTransactionsForDateRange(prisonerId, accountCode, fromDate, toDate)

      expect(mockRestClient.get).toHaveBeenCalledWith({
        path: `/api/offenders/${prisonerId}/transaction-history?account_code=${accountCode}&from_date=${formatDate(fromDate, DateFormats.ISO_DATE)}&to_date=${formatDate(toDate, DateFormats.ISO_DATE)}`,
      })
      expect(response).toEqual(mockResponse)
    })
  })
})
