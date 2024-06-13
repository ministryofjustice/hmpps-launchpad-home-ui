import { Location } from '../../@types/prisonApiTypes'

// eslint-disable-next-line import/prefer-default-export
export const location: Location = {
  locationId: 12345,
  locationType: 'Prison',
  description: 'Mock Location',
  locationUsage: 'Cell Block',
  agencyId: 'ABC',
  parentLocationId: 67890,
  currentOccupancy: 100,
  locationPrefix: 'MB-',
  operationalCapacity: 120,
  userDescription: 'Main Building',
  internalLocationCode: 'MB',
  subLocations: false,
}
