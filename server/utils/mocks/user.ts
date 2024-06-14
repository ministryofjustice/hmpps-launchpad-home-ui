import { UserDetail } from '../../@types/prisonApiTypes'
import { prisonAgencyIds } from '../../constants/prisons'

export const user: Express.User = {
  idToken: {
    name: 'Name',
    given_name: 'Given Name',
    family_name: 'Surname',
    nonce: '9/2VjkT3TW9ySSeoLdwx',
    iat: 1717668633,
    aud: '51133d0b-b174-4489-8f59-28794ea16129',
    sub: 'G1234UE',
    exp: 1717668933,
    iss: 'https://launchpad-auth-dev.test',
    booking: { id: '12345' },
    establishment: {
      id: prisonAgencyIds.CookhamWood,
      agency_id: prisonAgencyIds.CookhamWood,
      name: 'cookhamwood',
      display_name: 'HMYOI Cookham Wood',
      youth: true,
    },
  },
  refreshToken: 'refreshToken',
  accessToken: 'accessToken',
  token: 'token',
}

export const staffUser: UserDetail = {
  staffId: 231232,
  username: 'DEMO_USER1',
  firstName: 'John',
  lastName: 'Smith',
  thumbnailId: 2342341224,
  activeCaseLoadId: 'MDI',
  accountStatus: 'ACTIVE',
  lockDate: '2021-07-05T10:35:17',
  expiryDate: '2021-12-31T23:59:59',
  lockedFlag: false,
  expiredFlag: true,
  active: true,
}
