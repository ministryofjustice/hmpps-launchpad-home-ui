<<<<<<< HEAD
import { format } from 'date-fns'
import { HmppsAuthClient, RestClientBuilder, PrisonApiClient, IncentivesApiClient } from '../data'
import { EventsData, TimetableEvents, TimetableRow } from '../@types/launchpad'
import { IncentiveReviewSummary } from '../@types/incentivesApiTypes'
import Timetable from '../data/timetable'
import { DateFormats } from '../utils/enums'
=======
import { HmppsAuthClient, RestClientBuilder, PrisonApiClient } from '../data'
import { EventsData, TimetableEvents } from '../@types/launchpad' // TransactionData, AccountCode
import Timetable from '../data/timetable'
// import { Agency, OffenderTransactionHistoryDto } from '../@types/prisonApiTypes'
>>>>>>> 8fe9834 (Initial changes with commented out code)

export default class PrisonerProfileService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonApiClientFactory: RestClientBuilder<PrisonApiClient>,
    private readonly incentivesApiClientFactory: RestClientBuilder<IncentivesApiClient>,
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
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< called by server > routes > money > index.ts #31
  // createPrisonFormatter = (prisons: Agency[], key: keyof Agency): ((v: OffenderTransactionHistoryDto[]) => { prison: string }[]) => {
  //   const lookup = new Map(prisons.map(({ agencyId, description }) => [agencyId, description]))

  //   return (v: OffenderTransactionHistoryDto[]) =>
  //     v.map(item => ({
  //       ...item,
  //       prison: lookup.has(item[key] as string) ? lookup.get(item[key] as string) : (item[key] as string),
  //     }))
  // }

  // async getTransactionsFor(
  //   user: { idToken: { sub: string; booking: { id: string } } },
  //   accountCode: AccountCode,
  //   fromDate: Date,
  //   toDate: Date,
  // ): Promise<TransactionData> {
  //   const token = await this.hmppsAuthClient.getSystemClientToken() // dont do this on every request - do it once and store it in session
  //   const prisonApiClient = this.prisonApiClientFactory(token)
  //   const [transactionsResponse, balancesResponse, listOfPrisonsResponse] = await Promise.all([
  //     prisonApiClient.getTransactionsForDateRange(user.idToken.sub, { accountCode, fromDate, toDate }),
  //     prisonApiClient.getBalancesFor(user.idToken.booking.id),
  //     prisonApiClient.getPrisonDetails(),
  //   ])

  // console.log('transactionsResponse', transactionsResponse)
  /*
      [ 
        {
          offenderId: 2319320,
          transactionId: 407303270,
          transactionEntrySequence: 1,
          entryDate: '2023-09-18',
          transactionType: 'TELE',
          entryDescription: 'Television',
          referenceNumber: null,
          currency: 'GBP',
          penceAmount: 100,
          accountType: 'SPND',
          postingType: 'DR',
          offenderNo: 'G3682UE',
          agencyId: 'CKI',
          relatedOffenderTransactions: [],
          currentBalance: 43433,
          holdingCleared: false,
          createDateTime: '2023-09-18T01:31:22.053755'
        },
        ...]
      */
  // const listOfPrisons: Agency[] | [] = listOfPrisonsResponse || []

  // const convertPrisonIdToText = this.createPrisonFormatter(listOfPrisons, 'agencyId')

  // const transactionData = {
  //   transactions: transactionsResponse ? transactionsResponse.map(convertPrisonIdToText) : null,
  //   balances: balancesResponse,
  // }
  // }
}
