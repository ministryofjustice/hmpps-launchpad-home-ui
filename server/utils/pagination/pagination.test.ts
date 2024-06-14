import { getPaginationData } from './pagination'

describe(getPaginationData.name, () => {
  it('should return correct pagination data for the first page', () => {
    const result = getPaginationData(1, 50)
    expect(result).toEqual({
      page: 1,
      totalPages: 5,
      min: 1,
      max: 10,
      totalCount: 50,
    })
  })

  it('should return correct pagination data for the middle page', () => {
    const result = getPaginationData(3, 50)
    expect(result).toEqual({
      page: 3,
      totalPages: 5,
      min: 21,
      max: 30,
      totalCount: 50,
    })
  })

  it('should return correct pagination data for the last page', () => {
    const result = getPaginationData(5, 50)
    expect(result).toEqual({
      page: 5,
      totalPages: 5,
      min: 41,
      max: 50,
      totalCount: 50,
    })
  })

  it('should handle out-of-bound page numbers by returning the first page if page is too low', () => {
    const result = getPaginationData(-1, 50)
    expect(result).toEqual({
      page: 1,
      totalPages: 5,
      min: 1,
      max: 10,
      totalCount: 50,
    })
  })

  it('should handle out-of-bound page numbers by returning the last page if page is too high', () => {
    const result = getPaginationData(10, 50)
    expect(result).toEqual({
      page: 5,
      totalPages: 5,
      min: 41,
      max: 50,
      totalCount: 50,
    })
  })

  it('should handle a custom itemsPerPage value correctly', () => {
    const result = getPaginationData(1, 50, 20)
    expect(result).toEqual({
      page: 1,
      totalPages: 3,
      min: 1,
      max: 20,
      totalCount: 50,
    })
  })

  it('should handle an empty totalCount', () => {
    const result = getPaginationData(1, 0)
    expect(result).toEqual({
      page: 1,
      totalPages: 0,
      min: 1,
      max: 0,
      totalCount: 0,
    })
  })
})
