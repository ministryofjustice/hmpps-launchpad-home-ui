// eslint-disable-next-line import/prefer-default-export
export const formatBalances = (obj: Record<string, unknown>): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, typeof value === 'number' ? value.toFixed(2) : value]),
  )
}
