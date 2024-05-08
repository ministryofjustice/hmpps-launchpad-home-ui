import {
  HearingDto as BaseHearingDto,
  DisIssueHistoryDto,
  HearingOutcomeDto,
  IncidentDetailsDto,
  IncidentRoleDto,
  IncidentStatementDto,
  OffenceDto,
  OutcomeHistoryDto,
  PunishmentCommentDto,
  PunishmentDto,
  ReportedDamageDto,
  ReportedEvidenceDto,
  ReportedWitnessDto,
} from '../../@types/adjudicationsApiTypes'

type ExtendedHearingDto = BaseHearingDto & {
  location: string
  adjudicator: string
  offenceDetails: OffenceDto
  punishments: PunishmentDto[]
  outcome: Omit<HearingOutcomeDto, 'plea'> & { plea: string }
}

export type FormattedReportedAdjudication = {
  chargeNumber: string
  prisonerNumber: string
  gender: 'MALE' | 'FEMALE'
  incidentDetails: IncidentDetailsDto
  isYouthOffender: boolean
  incidentRole: IncidentRoleDto
  offenceDetails: OffenceDto
  incidentStatement: IncidentStatementDto
  createdByUserId: string
  createdDateTime: string
  status:
    | 'ACCEPTED'
    | 'REJECTED'
    | 'AWAITING_REVIEW'
    | 'RETURNED'
    | 'UNSCHEDULED'
    | 'SCHEDULED'
    | 'REFER_POLICE'
    | 'REFER_INAD'
    | 'REFER_GOV'
    | 'PROSECUTION'
    | 'DISMISSED'
    | 'NOT_PROCEED'
    | 'ADJOURNED'
    | 'CHARGE_PROVED'
    | 'QUASHED'
    | 'INVALID_OUTCOME'
    | 'INVALID_SUSPENDED'
    | 'INVALID_ADA'
  reviewedByUserId?: string
  statusReason?: string
  statusDetails?: string
  damages: ReportedDamageDto[]
  evidence: ReportedEvidenceDto[]
  witnesses: ReportedWitnessDto[]
  issuingOfficer?: string
  dateTimeOfIssue?: string
  disIssueHistory: DisIssueHistoryDto[]
  dateTimeOfFirstHearing?: string
  outcomes: OutcomeHistoryDto[]
  punishments: PunishmentDto[]
  punishmentComments: PunishmentCommentDto[]
  outcomeEnteredInNomis: boolean
  overrideAgencyId?: string
  originatingAgencyId: string
  transferableActionsAllowed?: boolean
  createdOnBehalfOfOfficer?: string
  createdOnBehalfOfReason?: string
  linkedChargeNumbers: string[]
  canActionFromHistory: boolean
  hearings: ExtendedHearingDto[]
  location: string
  reportedBy: string
}
