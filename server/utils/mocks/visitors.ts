import { PrisonerContact } from '../../@types/prisonerContactRegistryApiTypes'

// eslint-disable-next-line import/prefer-default-export
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
      startDate: '2015-03-01',
      phones: [],
      addressUsages: [],
    },
  ],
}
