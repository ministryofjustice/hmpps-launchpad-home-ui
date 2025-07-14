import { format } from 'date-fns'

import { HearingDto, OffenceDto, PunishmentDto, ReportedAdjudicationDto } from '../../@types/adjudicationsApiTypes'

import logger from '../../../logger'
import { DateFormats } from '../../constants/date'
import type { Services } from '../../services'
import { convertToTitleCase, toSentenceCase } from '../utils'
import { IdToken } from '../../@types/launchpad'

export const formatAdjudication = async (
  reportedAdjudication: ReportedAdjudicationDto,
  services: Services,
  userIdToken: IdToken,
) => {
  try {
    logger.info(`Formatting reported adjudication: ${reportedAdjudication.chargeNumber}`, {
      prisonerId: userIdToken.sub,
      agencyId: userIdToken.establishment.agency_id,
    })
    const reportedBy = await services.prisonService.getUserById(
      reportedAdjudication.createdByUserId,
      userIdToken.sub,
      userIdToken.establishment.agency_id,
    )
    const { dpsLocationId } = await services.nomisMappingService.nomisToDpsLocation(
      reportedAdjudication.incidentDetails.locationId,
      userIdToken.sub,
      userIdToken.establishment.agency_id,
    )
    const location = await services.locationService.getLocationById(
      dpsLocationId,
      userIdToken.sub,
      userIdToken.establishment.agency_id,
    )

    const formattedIncidentDetails = {
      ...reportedAdjudication.incidentDetails,
      dateTimeOfIncident: format(
        reportedAdjudication.incidentDetails.dateTimeOfIncident,
        DateFormats.GDS_PRETTY_DATE_TIME,
      ),
    }

    const formattedHearings = await Promise.all(
      reportedAdjudication.hearings.map(hearing =>
        formatHearing(
          hearing,
          reportedAdjudication.offenceDetails,
          reportedAdjudication.punishments,
          services,
          userIdToken,
        ),
      ),
    )

    return {
      ...reportedAdjudication,
      incidentDetails: formattedIncidentDetails,
      hearings: formattedHearings,
      location: location ? `${location.localName} (${location.prisonId})` : 'N/A',
      reportedBy: reportedBy ? `${reportedBy.firstName} ${reportedBy.lastName}` : 'N/A',
      reportDateTime: format(reportedAdjudication.createdDateTime, DateFormats.GDS_PRETTY_DATE_TIME),
    }
  } catch (error) {
    logger.error(`Error formatting reported adjudication: ${reportedAdjudication.chargeNumber}`, {
      prisonerId: userIdToken.sub,
      agencyId: userIdToken.establishment.agency_id,
      error,
    })
    return null
  }
}

export const formatHearing = async (
  hearing: HearingDto,
  offenceDetails: OffenceDto,
  punishments: PunishmentDto[],
  services: Services,
  userIdToken: IdToken,
) => {
  try {
    logger.info(`Formatting hearing: ${hearing.id}`, {
      prisonerId: userIdToken.sub,
      agencyId: userIdToken.establishment.agency_id,
    })
    const { dpsLocationId } = await services.nomisMappingService.nomisToDpsLocation(
      hearing.locationId,
      userIdToken.sub,
      userIdToken.establishment.agency_id,
    )
    const location = await services.locationService.getLocationById(
      dpsLocationId,
      userIdToken.sub,
      userIdToken.establishment.agency_id,
    )

    return {
      ...hearing,
      dateTimeOfHearing: format(hearing.dateTimeOfHearing, DateFormats.GDS_PRETTY_DATE_TIME),
      location: location ? `${location.localName}` : 'N/A',
      oicHearingType: hearing.oicHearingType === 'GOV_ADULT' ? 'Adult' : 'YOI',
      outcome: {
        ...hearing.outcome,
        plea: hearing.outcome?.plea ? convertToTitleCase(hearing.outcome?.plea).replace(/_/g, ' ') : 'N/A',
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
    logger.error(`Error formatting hearing: ${hearing.id}`, {
      prisonerId: userIdToken.sub,
      agencyId: userIdToken.establishment.agency_id,
      error,
    })
    return null
  }
}
