type PaginationData = {
  page: number
  totalPages: number
  min: number
  max: number
  totalCount: number
}

// eslint-disable-next-line import/prefer-default-export
export const getPaginationData = (rawPage: number, totalCount: number, itemsPerPage: number = 10): PaginationData => {
  const totalPages = Math.ceil(totalCount / itemsPerPage)
  const page = Math.max(1, Math.min(Math.round(rawPage) || 1, totalPages))
  const min = (page - 1) * itemsPerPage
  const max = Math.min(min + itemsPerPage, totalCount)

  return { page, totalPages, min: min + 1, max, totalCount }
}
