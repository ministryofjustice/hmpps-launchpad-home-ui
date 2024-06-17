import { format } from 'date-fns'

import {
  HearingDto,
  IncidentDetailsDto,
  OffenceDto,
  PunishmentDto,
  ReportedAdjudicationDto,
} from '../../@types/adjudicationsApiTypes'

import { DateFormats } from '../../constants/date'
import type { Services } from '../../services'
import { convertToTitleCase } from '../utils'

export const formatReportedAdjudication = async (reportedAdjudication: ReportedAdjudicationDto, services: Services) => {
  try {
    const reportedBy = await services.prisonService.getUserByUserId(reportedAdjudication.createdByUserId)
    const location = await services.prisonService.getLocationByLocationId(
      reportedAdjudication.incidentDetails.locationId,
    )

    const formattedIncidentDetails = formatIncidentDetails(reportedAdjudication.incidentDetails)
    const formattedHearings = await Promise.all(
      reportedAdjudication.hearings.map(hearing =>
        formatHearing(hearing, reportedAdjudication.offenceDetails, reportedAdjudication.punishments, services),
      ),
    )

    return {
      ...reportedAdjudication,
      incidentDetails: formattedIncidentDetails,
      hearings: formattedHearings,
      location: `${location?.userDescription} (${location?.agencyId})`,
      reportedBy: `${reportedBy?.firstName} ${reportedBy?.lastName}`,
    }
  } catch (error) {
    throw new Error(`Error formatting reported adjudication: ${error}`)
  }
}

export const formatIncidentDetails = (incidentDetails: IncidentDetailsDto): IncidentDetailsDto => {
  return {
    ...incidentDetails,
    dateTimeOfIncident: format(incidentDetails.dateTimeOfIncident, DateFormats.GDS_PRETTY_DATE_TIME),
    dateTimeOfDiscovery: format(incidentDetails.dateTimeOfDiscovery, DateFormats.GDS_PRETTY_DATE_TIME),
  }
}

export const formatHearing = async (
  hearing: HearingDto,
  offenceDetails: OffenceDto,
  punishments: PunishmentDto[],
  services: Services,
) => {
  try {
    const location = await services.prisonService.getLocationByLocationId(hearing.locationId)

    return {
      ...hearing,
      dateTimeOfHearing: format(hearing.dateTimeOfHearing, DateFormats.GDS_PRETTY_DATE_TIME),
      location: `${location?.userDescription}`,
      adjudicator: hearing.oicHearingType.includes('GOV') ? hearing.oicHearingType : `${hearing.outcome.adjudicator}`,
      outcome: {
        ...hearing.outcome,
        plea: convertToTitleCase(hearing.outcome.plea).replace(/_/g, ' '),
      },
      offenceDetails,
      punishments: punishments.map(punishment => ({
        ...punishment,
        effectiveDate: format(
          punishment.schedule.suspendedUntil || punishment.schedule.startDate,
          DateFormats.GDS_PRETTY_DATE,
        ),
      })),
    }
  } catch (error) {
    throw new Error(`Error formatting hearing: ${error}`)
  }
}
