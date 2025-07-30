import { auditService as auditClient } from '@ministryofjustice/hmpps-audit-client'
import { AUDIT_EVENTS, auditService } from './auditService'

const clientSpy = jest.spyOn(auditClient, 'sendAuditMessage')
const idToken = { sub: 'user', booking: { id: '1' }, establishment: { agency_id: '2' } }

describe('auditService', () => {
  describe('audit', () => {
    beforeEach(() => {
      jest.resetAllMocks()

      clientSpy.mockResolvedValue()
    })

    it('should send an audit using hmpps audit client', () => {
      auditService.audit({ what: AUDIT_EVENTS.VIEW_HOMEPAGE, idToken })

      expect(clientSpy).toHaveBeenCalledTimes(1)
      expect(clientSpy).toHaveBeenCalledWith({
        action: AUDIT_EVENTS.VIEW_HOMEPAGE,
        who: 'user',
        service: 'hmpps-launchpad-home-ui',
        details: JSON.stringify({
          bookingId: '1',
          agencyId: '2',
        }),
      })
    })

    it('should include any additional details', () => {
      auditService.audit({ what: AUDIT_EVENTS.VIEW_HOMEPAGE, idToken, details: { page: '1', sort: 'asc' } })

      expect(clientSpy).toHaveBeenCalledTimes(1)
      expect(clientSpy).toHaveBeenCalledWith({
        action: AUDIT_EVENTS.VIEW_HOMEPAGE,
        who: 'user',
        service: 'hmpps-launchpad-home-ui',
        details: JSON.stringify({
          page: '1',
          sort: 'asc',
          bookingId: '1',
          agencyId: '2',
        }),
      })
    })
  })
})
