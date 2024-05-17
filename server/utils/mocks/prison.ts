import { Agency } from '../../@types/prisonApiTypes'
import { AgencyType } from '../../constants/agency'

export const prison: Agency = {
  agencyId: 'MDI',
  description: 'Moorland (HMP & YOI)',
  agencyType: AgencyType.INST,
  active: true,
}
