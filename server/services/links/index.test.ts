import {
  expectToShowEveryTime,
  expectToShowWhenEstablishmentValueIsSetOnly,
  expectToShowWhenUserAllowListedOnly,
  expectToShowWhenUserWithinActiveAgencyOnly,
} from './index.test.helpers'

jest.mock('./activeAgencies')

jest.mock('../../utils/utils', () => ({
  ...jest.requireActual('../../utils/utils'),
  getEstablishmentData: jest.fn().mockReturnValue({
    hideInsideTime: true,
    hideThinkThroughNutrition: true,
  }),
}))

jest.mock('../../config', () => ({
  ...jest.requireActual('../../config').default,
  allowBetaAccessToPrisoners: 'prisoner 1,prisoner 2,prisoner 3',
}))

describe('LinkService', () => {
  describe('getHomepageLinks', () => {
    describe('Manage Apps tile', () => {
      expectToShowWhenUserWithinActiveAgencyOnly(0)
      expectToShowWhenUserAllowListedOnly(0)
    })

    describe('Self Service tile', () => {
      expectToShowEveryTime(1)
    })

    describe('Content-hub tile', () => {
      expectToShowEveryTime(2)
    })

    describe('National Prison Radio tile', () => {
      expectToShowEveryTime(3)
    })

    describe('Inside Time tile', () => {
      expectToShowWhenEstablishmentValueIsSetOnly(4, 'hideInsideTime', false, true)
    })

    describe('Think Through Nutrition tile', () => {
      expectToShowWhenEstablishmentValueIsSetOnly(5, 'hideThinkThroughNutrition', false, true)
    })

    describe('PIN Phone tile', () => {
      expectToShowWhenUserWithinActiveAgencyOnly(6)
    })
  })
})
