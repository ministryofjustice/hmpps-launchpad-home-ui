import { format } from 'date-fns'

import { HearingDto, OffenceDto, PunishmentDto, ReportedAdjudicationDto } from '../../@types/adjudicationsApiTypes'

import logger from '../../../logger'
import { DateFormats } from '../../constants/date'
import type { Services } from '../../services'
import { convertToTitleCase, toSentenceCase } from '../utils'

export const formatAdjudication = async (reportedAdjudication: ReportedAdjudicationDto, services: Services) => {
  try {
    const reportedBy = await services.prisonService.getUserById(reportedAdjudication.createdByUserId)
    const location = await services.prisonService.getLocationById(reportedAdjudication.incidentDetails.locationId)

    const formattedIncidentDetails = {
      ...reportedAdjudication.incidentDetails,
      dateTimeOfIncident: format(
        reportedAdjudication.incidentDetails.dateTimeOfIncident,
        DateFormats.GDS_PRETTY_DATE_TIME,
      ),
    }

    const formattedHearings = await Promise.all(
      reportedAdjudication.hearings.map(hearing =>
        formatHearing(hearing, reportedAdjudication.offenceDetails, reportedAdjudication.punishments, services),
      ),
    )

    return {
      ...reportedAdjudication,
      incidentDetails: formattedIncidentDetails,
      hearings: formattedHearings,
      location: location ? `${location.userDescription} (${location.agencyId})` : 'N/A',
      reportedBy: reportedBy ? `${reportedBy.firstName} ${reportedBy.lastName}` : 'N/A',
      reportDateTime: format(reportedAdjudication.createdDateTime, DateFormats.GDS_PRETTY_DATE_TIME),
    }
  } catch (error) {
    logger.error('Error formatting reported adjudication:', error)
    return null
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
      location: location ? `${location.userDescription}` : 'N/A',
      oicHearingType: hearing.oicHearingType === 'GOV_ADULT' ? 'Adult' : 'YOI',
      outcome: {
        ...hearing.outcome,
        plea: hearing.outcome.plea ? convertToTitleCase(hearing.outcome.plea).replace(/_/g, ' ') : 'N/A',
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
    logger.error('Error formatting hearing:', error)
    return null
  }
}
