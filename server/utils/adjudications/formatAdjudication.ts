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
import { convertToTitleCase, toSentenceCase } from '../utils'

export const formatAdjudication = async (reportedAdjudication: ReportedAdjudicationDto, services: Services) => {
  try {
    const reportedBy = await services.prisonService.getUserById(reportedAdjudication.createdByUserId)
    const location = await services.prisonService.getLocationById(reportedAdjudication.incidentDetails.locationId)

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
      location: location ? `${location?.userDescription} (${location?.agencyId})` : 'N/A',
      reportedBy: reportedBy ? `${reportedBy?.firstName} ${reportedBy?.lastName}` : 'N/A',
      reportDateTime: format(reportedAdjudication.createdDateTime, DateFormats.GDS_PRETTY_DATE_TIME),
    }
  } catch (error) {
    throw new Error(`Error formatting reported adjudication: ${error}`)
  }
}

export const formatIncidentDetails = (incidentDetails: IncidentDetailsDto): IncidentDetailsDto => {
  return {
    ...incidentDetails,
    dateTimeOfIncident: format(incidentDetails.dateTimeOfIncident, DateFormats.GDS_PRETTY_DATE_TIME),
  }
}

export const formatHearing = async (
  hearing: HearingDto,
  offenceDetails: OffenceDto,
  punishments: PunishmentDto[],
  services: Services,
) => {
  try {
    const location = await services.prisonService.getLocationById(hearing.locationId)

    return {
      ...hearing,
      dateTimeOfHearing: format(hearing.dateTimeOfHearing, DateFormats.GDS_PRETTY_DATE_TIME),
      location: location ? `${location?.userDescription}` : 'N/A',
      oicHearingType: hearing.oicHearingType === 'GOV_ADULT' ? 'Adult' : 'YOI',
      outcome: {
        ...hearing.outcome,
        plea: convertToTitleCase(hearing.outcome.plea).replace(/_/g, ' '),
      },
      offenceDetails,
      punishments: punishments.map(punishment => ({
        ...punishment,
        effectiveDate:
          punishment.schedule.suspendedUntil || punishment.schedule.startDate
            ? format(punishment.schedule.suspendedUntil || punishment.schedule.startDate, DateFormats.GDS_PRETTY_DATE)
            : 'N/A',
        type: toSentenceCase(punishment.type),
      })),
    }
  } catch (error) {
    throw new Error(`Error formatting hearing: ${error}`)
  }
}
