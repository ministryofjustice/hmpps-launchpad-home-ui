import { format } from 'date-fns'
import {
  Hearing,
  IncidentDetailsDto,
  Offence,
  Punishment,
  ReportedAdjudicationDto,
} from '../../@types/adjudicationsApiTypes'
import type { Services } from '../../services'
import { DateFormats } from '../enums'
import { convertToTitleCase } from '../utils'

// eslint-disable-next-line import/prefer-default-export
export const formatReportedAdjudication = async (reportedAdjudication: ReportedAdjudicationDto, services: Services) => {
  const reportedBy = await services.prisonerProfileService.getUserByUserId(reportedAdjudication.createdByUserId)
  const location = await services.prisonerProfileService.getLocationByLocationId(
    reportedAdjudication.incidentDetails.locationId,
  )

  return {
    ...reportedAdjudication,
    incidentDetails: formatIncidentDetails(reportedAdjudication.incidentDetails),
    hearings: await Promise.all(
      reportedAdjudication.hearings.map((hearing, i) =>
        formatHearing(hearing, reportedAdjudication.offenceDetails, reportedAdjudication.punishments, services),
      ),
    ),
    location: `${location.userDescription} (${location.agencyId})`,
    reportedBy: `${reportedBy.firstName} ${reportedBy.lastName}`,
  }
}

const formatIncidentDetails = (incidentDetails: IncidentDetailsDto): IncidentDetailsDto => {
  return {
    ...incidentDetails,
    dateTimeOfIncident: format(incidentDetails.dateTimeOfIncident, DateFormats.GDS_PRETTY_DATE_TIME),
    dateTimeOfDiscovery: format(incidentDetails.dateTimeOfDiscovery, DateFormats.GDS_PRETTY_DATE_TIME),
  }
}

const formatHearing = async (
  hearing: Hearing,
  offenceDetails: Offence,
  punishments: Punishment[],
  services: Services,
) => {
  const location = await services.prisonerProfileService.getLocationByLocationId(hearing.locationId)

  return {
    ...hearing,
    dateTimeOfHearing: format(hearing.dateTimeOfHearing, DateFormats.GDS_PRETTY_DATE_TIME),
    location: `${location.userDescription}`,
    adjudicator: hearing.oicHearingType.includes('GOV') ? hearing.oicHearingType : `${hearing.outcome.adjudicator}`,
    outcome: {
      ...hearing.outcome,
      details: hearing.outcome.details,
      plea: convertToTitleCase(hearing.outcome.plea).replace(/_/g, ' '),
    },
    offenceDetails,
    punishments: punishments.map(punishment => ({
      ...punishment,
      effectiveDate: punishment.schedule.suspendedUntil
        ? format(punishment.schedule.suspendedUntil, DateFormats.GDS_PRETTY_DATE)
        : format(punishment.schedule.startDate, DateFormats.GDS_PRETTY_DATE),
    })),
  }
}
