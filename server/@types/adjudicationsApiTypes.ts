import { components } from './adjudications-api'

export type HasAdjudicationsResponse = components['schemas']['HasAdjudicationsResponse']
export type PageReportedAdjudicationDto = components['schemas']['PageReportedAdjudicationDto']
export type ReportedAdjudicationDto = components['schemas']['ReportedAdjudicationDto']
export type IncidentDetailsDto = components['schemas']['IncidentDetailsDto']
export type ReportedAdjudicationApiResponse = { reportedAdjudication: ReportedAdjudicationDto }
export type Hearing = components['schemas']['HearingDto']
export type Offence = components['schemas']['OffenceDto']
export type Punishment = components['schemas']['PunishmentDto']
