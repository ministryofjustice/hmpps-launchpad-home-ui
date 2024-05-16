export const formatCurrency = (amount: number, currency: string) => {
  if (amount === null || Number.isNaN(Number(amount)) || !currency) return null

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(amount)
}
