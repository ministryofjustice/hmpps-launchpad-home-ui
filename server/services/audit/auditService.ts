import { auditService as auditClient } from '@ministryofjustice/hmpps-audit-client'
import config from '../../config'

export const enum AUDIT_EVENTS {
  DELETE_APP_ACCESS = 'DELETE_APP_ACCESS',
  LOGGED_IN = 'LOGGED_IN',
  VIEW_ADJUDICATIONS = 'VIEW_ADJUDICATIONS',
  VIEW_CHARGE = 'VIEW_CHARGE',
  VIEW_DAMAGE_OBLIGATIONS = 'VIEW_DAMAGE_OBLIGATIONS',
  VIEW_EXTERNAL_PAGE = 'VIEW_EXTERNAL_PAGE',
  VIEW_HOMEPAGE = 'VIEW_HOMEPAGE',
  VIEW_PROFILE = 'VIEW_PROFILE',
  VIEW_REMOVE_APP_ACCESS = 'VIEW_REMOVE_APP_ACCESS',
  VIEW_SETTINGS = 'VIEW_SETTINGS',
  VIEW_TIMETABLE = 'VIEW_TIMETABLE',
  VIEW_TRANSACTIONS = 'VIEW_TRANSACTIONS',
  VIEW_VISITS = 'VIEW_VISITS',
}

export interface AuditEvent {
  what: AUDIT_EVENTS
  idToken: { sub: string; establishment: { agency_id: string }; booking: { id: string } }
  details?: object
}

export declare class AuditService {
  audit(event: AuditEvent): Promise<void>
}

export const auditService: AuditService = {
  audit: async ({ what, idToken, details }: AuditEvent) => {
    await auditClient.sendAuditMessage({
      action: what,
      who: idToken.sub,
      service: config.apis.audit.serviceName,
      details: JSON.stringify({
        ...details,
        bookingId: idToken.booking.id,
        agencyId: idToken.establishment.agency_id,
      }),
    })
  },
}
