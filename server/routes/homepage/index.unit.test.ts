import { showEventsSummaryAndProfileLinkTile } from './index'

jest.mock('../../config', () => ({
  ...jest.requireActual('../../config'),
  allowEventsAndProfileTileToPrisoners: 'GA11111,GB22222',
}))

describe('showEventsSummaryAndProfileLinkTile', () => {
  describe('when the feature is not hidden in config', () => {
    it('returns true', () => {
      expect(showEventsSummaryAndProfileLinkTile(false, '')).toEqual(true)
    })
  })

  describe('when the feature is hidden in config', () => {
    describe('when the user is named to be allowed to view the tiles', () => {
      it('returns true', () => {
        expect(showEventsSummaryAndProfileLinkTile(true, 'GA11111')).toEqual(true)
      })
    })

    describe('when the user is not named to be allowed to view the tiles', () => {
      it('returns true', () => {
        expect(showEventsSummaryAndProfileLinkTile(true, 'GA11119')).toEqual(false)
      })
    })
  })
})
