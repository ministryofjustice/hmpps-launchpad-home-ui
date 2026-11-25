import {
  expectToShowEveryTime,
  expectToShowWhenEstablishmentValueIsSetOnly,
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
    })

    describe('PIN Phone tile', () => {
      expectToShowWhenUserWithinActiveAgencyOnly(1)
    })

    describe('Canteen tile', () => {
      expectToShowWhenUserWithinActiveAgencyOnly(2)
    })

    describe('Self Service tile', () => {
      expectToShowEveryTime(3)
    })

    describe('Content-hub Legacy tile', () => {
      expectToShowWhenUserWithinActiveAgencyOnly(4)
    })

    describe('Content-hub tile', () => {
      expectToShowWhenUserWithinActiveAgencyOnly(5)
    })

    describe('National Prison Radio tile', () => {
      expectToShowEveryTime(6)
    })

    describe('Inside Time tile', () => {
      expectToShowWhenEstablishmentValueIsSetOnly(7, 'hideInsideTime', false, true)
    })

    describe('Think Through Nutrition tile', () => {
      expectToShowWhenEstablishmentValueIsSetOnly(8, 'hideThinkThroughNutrition', false, true)
    })

    describe('Prison Reform Trust tile', () => {
      expectToShowWhenEstablishmentValueIsSetOnly(9, 'hidePrisonReformTrust', false, true)
    })
  })
})
