import { addDays, format, subDays } from 'date-fns'
import { stubFor } from './wiremock'

const toIsoDate = (date: Date) => format(date, 'yyyy-MM-dd')

const buildDayEvents = (bookingId: string, date: string, dayOffset = 0) => [
  {
    id: `evt-${date}-1`,
    bookingId,
    startTime: `${date}T08:45:00`,
    endTime: `${date}T10:00:00`,
    eventSubType: 'PA',
    eventSubTypeDesc: 'Prison Activities',
    eventSourceDesc: dayOffset % 2 === 0 ? 'Education' : 'Workshop',
    eventLocation: dayOffset % 2 === 0 ? 'Education room 2' : 'Workshop 4',
  },
  {
    id: `evt-${date}-2`,
    bookingId,
    startTime: `${date}T10:30:00`,
    endTime: `${date}T11:45:00`,
    eventSubType: 'APP',
    eventSubTypeDesc: 'Appointment',
    eventSourceDesc: 'Key worker session',
    eventLocation: 'Residential unit office',
  },
  {
    id: `evt-${date}-3`,
    bookingId,
    startTime: `${date}T13:15:00`,
    endTime: `${date}T14:30:00`,
    eventSubType: 'PA',
    eventSubTypeDesc: 'Prison Activities',
    eventSourceDesc: dayOffset % 3 === 0 ? 'Gym' : 'Library',
    eventLocation: dayOffset % 3 === 0 ? 'Gymnasium' : 'Library',
  },
  {
    id: `evt-${date}-4`,
    bookingId,
    startTime: `${date}T15:00:00`,
    endTime: `${date}T16:00:00`,
    eventSubType: 'MEAL',
    eventSubTypeDesc: 'Meal',
    eventSourceDesc: 'Lunch',
    eventLocation: 'Dining hall',
  },
  {
    id: `evt-${date}-5`,
    bookingId,
    startTime: `${date}T18:00:00`,
    endTime: `${date}T19:00:00`,
    eventSubType: 'PA',
    eventSubTypeDesc: 'Prison Activities',
    eventSourceDesc: dayOffset % 2 === 0 ? 'Association' : 'Wing meeting',
    eventLocation: dayOffset % 2 === 0 ? 'Association area' : 'Wing 3 office',
  },
]

const buildEventRange = (bookingId: string, startDate?: string, endDate?: string) => {
  const rangeStart = startDate ? new Date(`${startDate}T00:00:00`) : new Date()
  const rangeEnd = endDate ? new Date(`${endDate}T00:00:00`) : addDays(new Date(), 2)
  const events = []

  for (let currentDate = rangeStart, dayOffset = 0; currentDate <= rangeEnd; currentDate = addDays(currentDate, 1)) {
    events.push(...buildDayEvents(bookingId, toIsoDate(currentDate), dayOffset))
    dayOffset += 1
  }

  return events
}

const buildTransactionHistory = (prisonerId: string, accountCode: string, currentDate = new Date()) => {
  const monthDate = toIsoDate(currentDate)
  const earlierDate = toIsoDate(subDays(currentDate, 3))

  const transactionSets: Record<string, Array<Record<string, unknown>>> = {
    spends: [
      {
        offenderId: 2319320,
        transactionId: 431240219,
        transactionEntrySequence: 1,
        entryDate: monthDate,
        transactionType: 'A_EARN',
        entryDescription: 'Workshop pay',
        referenceNumber: null,
        currency: 'GBP',
        penceAmount: 950,
        accountType: 'SPND',
        postingType: 'CR',
        offenderNo: prisonerId,
        agencyId: 'BWI',
        relatedOffenderTransactions: [
          {
            id: 96667542,
            transactionId: 431240219,
            transactionEntrySequence: 1,
            calendarDate: earlierDate,
            payTypeCode: 'WORK',
            eventId: null,
            payAmount: 950,
            pieceWork: 0,
            bonusPay: 0,
            currentBalance: 23450,
            paymentDescription: 'Workshop pay',
          },
        ],
        currentBalance: 23450,
        holdingCleared: false,
        createDateTime: `${monthDate}T08:15:00`,
      },
      {
        offenderId: 2319320,
        transactionId: 431240220,
        transactionEntrySequence: 1,
        entryDate: earlierDate,
        transactionType: 'CANTEEN',
        entryDescription: 'Canteen purchase',
        referenceNumber: 'CAN-1001',
        currency: 'GBP',
        penceAmount: 425,
        accountType: 'SPND',
        postingType: 'DR',
        offenderNo: prisonerId,
        agencyId: 'BWI',
        relatedOffenderTransactions: [],
        currentBalance: 22500,
        holdingCleared: false,
        createDateTime: `${earlierDate}T14:00:00`,
      },
    ],
    cash: [
      {
        offenderId: 2319320,
        transactionId: 431240221,
        transactionEntrySequence: 1,
        entryDate: monthDate,
        transactionType: 'PRIVATE_CASH',
        entryDescription: 'Private cash deposit',
        referenceNumber: 'PC-2002',
        currency: 'GBP',
        penceAmount: 1200,
        accountType: 'CASH',
        postingType: 'CR',
        offenderNo: prisonerId,
        agencyId: 'BWI',
        relatedOffenderTransactions: [],
        currentBalance: 1200,
        holdingCleared: false,
        createDateTime: `${monthDate}T11:30:00`,
      },
      {
        offenderId: 2319320,
        transactionId: 431240222,
        transactionEntrySequence: 1,
        entryDate: earlierDate,
        transactionType: 'PHONE',
        entryDescription: 'Phone credit top-up',
        referenceNumber: 'PH-4003',
        currency: 'GBP',
        penceAmount: 300,
        accountType: 'CASH',
        postingType: 'DR',
        offenderNo: prisonerId,
        agencyId: 'BWI',
        relatedOffenderTransactions: [],
        currentBalance: 900,
        holdingCleared: false,
        createDateTime: `${earlierDate}T16:45:00`,
      },
    ],
    savings: [
      {
        offenderId: 2319320,
        transactionId: 431240223,
        transactionEntrySequence: 1,
        entryDate: monthDate,
        transactionType: 'TRANSFER',
        entryDescription: 'Savings transfer in',
        referenceNumber: 'SV-3001',
        currency: 'GBP',
        penceAmount: 2500,
        accountType: 'SAV',
        postingType: 'CR',
        offenderNo: prisonerId,
        agencyId: 'BWI',
        relatedOffenderTransactions: [],
        currentBalance: 50000,
        holdingCleared: false,
        createDateTime: `${monthDate}T09:30:00`,
      },
      {
        offenderId: 2319320,
        transactionId: 431240224,
        transactionEntrySequence: 1,
        entryDate: earlierDate,
        transactionType: 'TRANSFER',
        entryDescription: 'Savings transfer out',
        referenceNumber: 'SV-3002',
        currency: 'GBP',
        penceAmount: 500,
        accountType: 'SAV',
        postingType: 'DR',
        offenderNo: prisonerId,
        agencyId: 'BWI',
        relatedOffenderTransactions: [],
        currentBalance: 47500,
        holdingCleared: false,
        createDateTime: `${earlierDate}T10:30:00`,
      },
    ],
  }

  return transactionSets[accountCode] || transactionSets.spends
}

const damageObligations = [
  {
    id: 6027,
    offenderNo: 'G3682UE',
    referenceNumber: '1077480',
    startDateTime: '2025-01-05T00:00:00',
    endDateTime: '2025-03-05T00:00:00',
    prisonId: 'BWI',
    amountToPay: 20,
    amountPaid: 5,
    status: 'ACTIVE',
    currency: 'GBP',
    comment: 'Replacement headphones',
  },
  {
    id: 6028,
    offenderNo: 'G3682UE',
    referenceNumber: '1077481',
    startDateTime: '2025-02-12T00:00:00',
    endDateTime: '2025-04-12T00:00:00',
    prisonId: 'BWI',
    amountToPay: 12,
    amountPaid: 3,
    status: 'ACTIVE',
    currency: 'GBP',
    comment: 'Damaged kettle',
  },
]

const prisonsByAgencyType = [
  { agencyId: 'BWI', description: 'Berwyn (HMP)' },
  { agencyId: 'CFI', description: 'Cardiff (HMP)' },
]

export default {
  // Prison API - Homepage events summary endpoint
  stubGetEventsSummary: (bookingId = 'G6123VG') =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/api/bookings/${bookingId}/events/today[?].*`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: buildDayEvents(bookingId, toIsoDate(new Date())).slice(0, 3),
      },
    }),

  // Prison API - Events/Timetable endpoints
  stubGetEvents: (
    bookingId = 'G6123VG',
    startDate = toIsoDate(new Date()),
    endDate = toIsoDate(addDays(new Date(), 2)),
  ) =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/api/bookings/${bookingId}/events[?].*`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: buildEventRange(bookingId, startDate, endDate),
      },
    }),

  // Prison API - Account Balances endpoint
  stubGetBalances: (bookingId = 'G6123VG') =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/api/bookings/${bookingId}/balances`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          spends: 234.5,
          cash: 12.0,
          savings: 500.0,
          damageObligations: 24,
          currency: 'GBP',
        },
      },
    }),

  // Prison API - Agency list used to map transaction rows to prisons
  stubGetPrisonsByAgencyType: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/api/agencies/type/INST',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: prisonsByAgencyType,
      },
    }),

  // Prison API - Transaction history used by the money tables
  stubGetTransactions: (prisonerId = 'G3682UE') =>
    ['spends', 'cash', 'savings'].map(accountCode =>
      stubFor({
        request: {
          method: 'GET',
          urlPattern: `/api/offenders/${prisonerId}/transaction-history\\?account_code=${accountCode}&from_date=.*&to_date=.*`,
        },
        response: {
          status: 200,
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          jsonBody: buildTransactionHistory(prisonerId, accountCode),
        },
      }),
    ),

  // Prison API - Damage obligations table
  stubGetDamageObligations: (prisonerId = 'G3682UE') =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/api/offenders/${prisonerId}/damage-obligations`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          damageObligations: damageObligations.map(obligation => ({ ...obligation, offenderNo: prisonerId })),
        },
      },
    }),

  // Prison API - Next Visit endpoint
  stubGetNextVisit: (bookingId = 'G6123VG') =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/api/bookings/${bookingId}/visits/next.*`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          id: 'visit1',
          bookingId,
          startTime: '2025-02-15T14:00:00',
          endTime: '2025-02-15T15:30:00',
          visitTypeDescription: 'Social Visit',
          visitors: [
            {
              personId: 'P123',
              firstName: 'John',
              lastName: 'Smith',
              relationshipCode: 'FA',
            },
          ],
        },
      },
    }),

  // Prison API - Visit Balances endpoint
  stubGetVisitBalances: (prisonerId = 'G3682UE') =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/api/bookings/offenderNo/${prisonerId}/visit/balances`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          prisonerId,
          remainingVo: 10,
          remainingPvo: 5,
        },
      },
    }),

  // Adjudications API - hasAdjudications endpoint
  stubHasAdjudications: (bookingId = 'G6123VG', hasAdjudications = false) =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/adjudications/booking/${bookingId}/exists`,
        headers: {
          'Active-Caseload': {
            matches: '.*',
          },
        },
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          hasAdjudications,
        },
      },
    }),

  // Incentives API - getIncentivesSummaryFor endpoint
  stubGetIncentivesSummary: (bookingId = 'G6123VG') =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/incentive-reviews/booking/${bookingId}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          bookingId,
          iepCode: 'STD',
          iepLevel: 'Standard',
          iepTime: '2024-12-01T10:00:00',
          nextReviewTime: '2025-03-01T10:00:00',
        },
      },
    }),
}
