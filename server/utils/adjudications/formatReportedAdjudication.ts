import { format } from 'date-fns'
import { Hearing, IncidentDetailsDto, Offence, ReportedAdjudicationDto } from '../../@types/adjudicationsApiTypes'
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
    hearings: await Promise.all(
      reportedAdjudication.hearings.map(hearing =>
        formatHearing(hearing, reportedAdjudication.offenceDetails, services),
      ),
    ),
    location: `${location.userDescription} (${location.agencyId})`,
    reportedBy: `${reportedBy.firstName} ${reportedBy.lastName}`,
    incidentDetails: formatIncidentDetails(reportedAdjudication.incidentDetails),
  }
}

const formatHearing = async (hearing: Hearing, offenceDetails: Offence, services: Services) => {
  const location = await services.prisonerProfileService.getLocationByLocationId(hearing.locationId)

  return {
    ...hearing,
    dateTimeOfHearing: format(hearing.dateTimeOfHearing, DateFormats.GDS_PRETTY_DATE_TIME),
    location: `${location.userDescription}`,
    adjudicator: hearing.oicHearingType.includes('GOV') ? hearing.oicHearingType : `${hearing.outcome.adjudicator}`,
    outcome: {
      ...hearing.outcome,
      details: hearing.outcome.details,
      plea: convertToTitleCase(hearing.outcome.plea),
    },
    offenceDetails,
  }
}

const formatIncidentDetails = (incidentDetails: IncidentDetailsDto): IncidentDetailsDto => {
  return {
    ...incidentDetails,
    dateTimeOfIncident: format(incidentDetails.dateTimeOfIncident, DateFormats.GDS_PRETTY_DATE_TIME),
    dateTimeOfDiscovery: format(incidentDetails.dateTimeOfDiscovery, DateFormats.GDS_PRETTY_DATE_TIME),
  }
}
