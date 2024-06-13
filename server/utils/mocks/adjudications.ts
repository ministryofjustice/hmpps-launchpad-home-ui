import { ReportedAdjudicationDto } from '../../@types/adjudicationsApiTypes'
import { FormattedReportedAdjudication } from '../adjudications/types'

export const reportedAdjudication: ReportedAdjudicationDto = {
  chargeNumber: '409064-1',
  prisonerNumber: 'G6046GQ',
  gender: 'MALE',
  incidentDetails: {
    locationId: 78668,
    dateTimeOfIncident: '2011-01-28T11:52:00',
    dateTimeOfDiscovery: '2011-01-28T11:52:00',
    handoverDeadline: '2011-01-30T11:52:00',
  },
  isYouthOffender: false,
  incidentRole: {},
  offenceDetails: {
    offenceCode: 0,
    offenceRule: {
      paragraphNumber: '51:12',
      paragraphDescription:
        'Has in his possession-(a) any unauthorised article, or (b) a greater quantity of any article than he is authorised to have',
    },
  },
  incidentStatement: {
    statement:
      'rjowXkIlphbUTbkxkvuJBsgqXYnbsywoUbmLQPdVuYectcgbJrkhoGlOIcYPjEZJJNgjrOTfUYmvUNSgQYIhEiCcEKazUCeEmKMlqzHdQXcJTEvYBgwonclNYGjLRxjGiygLMZKhwrjowXkIlphbUTbkxkvuJBsgqXYnbsywoUbmLQPdVuYectcgbJrkhoGlOIcYPjEZJJNgjrOTfUYmvUNSgQYIhEiCcEKazUCeEmKMlqzHdQXcJTEvYBgwonclNYGjLRxjGiygLMZKhw',
    completed: true,
  },
  createdByUserId: 'HQT52N',
  createdDateTime: '2011-01-28T11:52:00',
  status: 'NOT_PROCEED',
  damages: [
    {
      code: 'FURNITURE_OR_FABRIC_REPAIR',
      details: 'fZBeRelBeoedfZBeRelBeoe',
      reporter: 'HQT52N',
    },
  ],
  evidence: [],
  witnesses: [
    {
      code: 'OTHER_PERSON',
      firstName: 'ICLQUENS',
      lastName: 'HANNISTA',
      reporter: 'HQT52N',
    },
  ],
  hearings: [
    {
      id: 294486,
      locationId: 78703,
      dateTimeOfHearing: '2011-02-18T10:00:00',
      oicHearingType: 'GOV_ADULT',
      outcome: {
        id: 284319,
        adjudicator: 'IQS13Z',
        code: 'COMPLETE',
        details: '',
        plea: 'ABSTAIN',
      },
      agencyId: 'GHI',
    },
  ],
  disIssueHistory: [],
  outcomes: [
    {
      hearing: {
        id: 294486,
        locationId: 78703,
        dateTimeOfHearing: '2011-02-18T10:00:00',
        oicHearingType: 'GOV_ADULT',
        outcome: {
          id: 284319,
          adjudicator: 'IQS13Z',
          code: 'COMPLETE',
          details: '',
          plea: 'ABSTAIN',
        },
        agencyId: 'GHI',
      },
      outcome: {
        outcome: {
          id: 248206,
          code: 'NOT_PROCEED',
          reason: 'RELEASED',
          canRemove: true,
        },
      },
    },
  ],
  punishments: [],
  punishmentComments: [],
  outcomeEnteredInNomis: false,
  overrideAgencyId: 'BWI',
  originatingAgencyId: 'GHI',
  transferableActionsAllowed: true,
  linkedChargeNumbers: [],
  canActionFromHistory: false,
}

export const formattedAdjudication: FormattedReportedAdjudication = {
  ...reportedAdjudication,
  hearings: [
    {
      id: 294486,
      locationId: 78703,
      dateTimeOfHearing: '18 February 2011, 10.00am',
      oicHearingType: 'GOV_ADULT',
      outcome: {
        id: 284319,
        adjudicator: 'IQS13Z',
        code: 'COMPLETE',
        details: '',
        plea: 'ABSTAIN',
      },
      agencyId: 'GHI',
      location: 'Seg Adj. Room',
      adjudicator: 'GOV_ADULT',
      offenceDetails: {
        offenceCode: 0,
        offenceRule: {
          paragraphNumber: '51:12',
          paragraphDescription:
            'Has in his possession-(a) any unauthorised article, or (b) a greater quantity of any article than he is authorised to have',
        },
      },
      punishments: [],
    },
  ],
  location: 'Reception (GHI)',
  reportedBy: 'Iclquens Hannista',
}
