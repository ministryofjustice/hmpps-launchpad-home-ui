import { components } from './adjudications-api'

export type DisIssueHistoryDto = components['schemas']['DisIssueHistoryDto']
export type HearingDto = components['schemas']['HearingDto']
export type HearingOutcomeDto = components['schemas']['HearingOutcomeDto']
export type IncidentDetailsDto = components['schemas']['IncidentDetailsDto']
export type IncidentRoleDto = components['schemas']['IncidentRoleDto']
export type IncidentStatementDto = components['schemas']['IncidentStatementDto']
export type OffenceDto = components['schemas']['OffenceDto']
export type OutcomeHistoryDto = components['schemas']['OutcomeHistoryDto']
export type PageReportedAdjudicationDto = components['schemas']['PageReportedAdjudicationDto']
export type PunishmentDto = components['schemas']['PunishmentDto']
export type PunishmentCommentDto = components['schemas']['PunishmentCommentDto']
export type ReportedAdjudicationDto = components['schemas']['ReportedAdjudicationDto']
export type ReportedDamageDto = components['schemas']['ReportedDamageDto']
export type ReportedEvidenceDto = components['schemas']['ReportedEvidenceDto']
export type ReportedWitnessDto = components['schemas']['ReportedWitnessDto']

export type HasAdjudicationsResponse = components['schemas']['HasAdjudicationsResponse']
export type ReportedAdjudicationApiResponse = { reportedAdjudication: ReportedAdjudicationDto | null }
