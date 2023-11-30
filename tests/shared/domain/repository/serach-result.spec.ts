import { SearchResult } from '../../../../src/shared/domain/repository/search-result'

describe('Search Result Unit Test', () => {
  test('constructor props', () => {
    const result = new SearchResult({
      items: ['entity1', 'entity2'] as any,
      total: 4,
      current_page: 1,
      per_page: 2
    })

    expect(result.toJSON()).toStrictEqual({
      items: ['entity1', 'entity2'] as any,
      total: 4,
      current_page: 1,
      per_page: 2,
      last_page: 2
    })
  })

  test('should set last_page = 1 when per_page field is greater than total field', () => {
    const result = new SearchResult({
      items: [] as any,
      total: 4,
      current_page: 1,
      per_page: 15
    })

    expect(result.toJSON().last_page).toBe(1)
  })
})