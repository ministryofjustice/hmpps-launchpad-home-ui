import { ifWithinActiveAgency } from './activeAgencies'

describe('ifWithinActiveAgency', () => {
  const testCases = [
    ['RNI', ['CKI', 'RNI'], true],
    ['RNI', ['***'], true],
    ['RNI', ['LEI'], false],
    ['RNI', [], false],
    ['RNI', undefined, false],
    ['CKI', ['CKI', 'RNI'], true],
    ['CKI', ['***'], true],
    ['CKI', ['LEI'], false],
    ['CKI', [], false],
    ['CKI', undefined, false],
    ['LEI', ['CKI', 'RNI'], false],
    ['LEI', ['***'], true],
    ['LEI', ['LEI'], true],
    ['LEI', [], false],
    ['LEI', undefined, false],
    [undefined, ['CKI', 'RNI'], false],
    [undefined, ['***'], true],
    [undefined, ['LEI'], false],
    [undefined, [], false],
    [undefined, undefined, false],
  ]

  test.each(testCases)(
    'my agency is %s, activeAgencies is %s, ifWithinActiveAgency returns %s',
    async (currentAgency: string, activeAgencies: string[], expectedResult: boolean) => {
      const activeAgenciesFetcher = jest.fn().mockResolvedValue(activeAgencies)
      expect(await ifWithinActiveAgency(currentAgency, 'service url', activeAgenciesFetcher)).toEqual(expectedResult)
    },
  )
})
