import { VisitBalances } from '../../@types/prisonApiTypes'
import { PrisonerContact } from '../../@types/prisonerContactRegistryApiTypes'

export const prisonerContact: PrisonerContact = {
  personId: 3735390,
  firstName: 'firstName',
  lastName: 'lastName',
  dateOfBirth: '2005-06-20',
  relationshipCode: 'SIS',
  relationshipDescription: 'Sister',
  contactType: 'S',
  contactTypeDescription: 'Social/Family',
  approvedVisitor: true,
  emergencyContact: false,
  nextOfKin: false,
  restrictions: [],
  addresses: [
    {
      premise: 'zz',
      street: 'RQtwMDRQtwMD',
      locality: 'HWslHWsl',
      town: 'Stroud',
      postalCode: 'KK1 6CD',
      county: 'Kent',
      country: 'England',
      primary: false,
      noFixedAddress: false,
    },
  ],
  address: {
    premise: 'zz',
    street: 'RQtwMDRQtwMD',
    locality: 'HWslHWsl',
    town: 'Stroud',
    postalCode: 'KK1 6CD',
    county: 'Kent',
    country: 'England',
    primary: false,
    noFixedAddress: false,
  }
}

export const visitBalances: VisitBalances = {
  remainingVo: 26,
  remainingPvo: 0,
  latestIepAdjustDate: '2017-03-31',
  latestPrivIepAdjustDate: '2024-10-01',
}
