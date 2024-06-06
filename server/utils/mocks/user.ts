import { prisonAgencyIds } from '../../constants/prisons'

// eslint-disable-next-line import/prefer-default-export
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
