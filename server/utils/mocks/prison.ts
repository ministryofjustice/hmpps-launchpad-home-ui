import { Agency } from '../../@types/prisonApiTypes'
import { AgencyType } from '../../constants/agency'

// eslint-disable-next-line import/prefer-default-export
export const prison: Agency = {
  agencyId: 'MDI',
  description: 'Moorland (HMP & YOI)',
  agencyType: AgencyType.INST,
  active: true,
}
