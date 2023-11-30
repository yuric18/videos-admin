import { SearchParams } from '../../../../src/shared/domain/repository/search-params'

describe('SeachParams Unit Tests', () => {
  describe('page prop', () => {

    test('should have default value 1', () => {
      const params = new SearchParams()
      expect(params.page).toBe(1)
    })

    const arrange = [
      { page: null, expected: 1 },
      { page: undefined, expected: 1 },
      { page: '', expected: 1 },
      { page: 'fake', expected: 1 },
      { page: 0, expected: 1 },
      { page: -1, expected: 1 },
      { page: 5.5, expected: 1 },
      { page: true, expected: 1 },
      { page: false, expected: 1 },
      { page: {}, expected: 1 },
      { page: 1, expected: 1 },
      { page: 2, expected: 2 }
    ]

    arrange.forEach(({ page, expected }) => {
      test(`Page ${page} should have ${expected} value`, () => {
        expect(new SearchParams({ page: page as any }).page).toBe(expected)
      })
    })
  })

  describe('per_page prop', () => {

    test('should have default value 15', () => {
      const params = new SearchParams()
      expect(params.per_page).toBe(15)
    })

    const arrange = [
      { per_page: null, expected: 15 },
      { per_page: undefined, expected: 15 },
      { per_page: '', expected: 15 },
      { per_page: 'fake', expected: 15 },
      { per_page: 0, expected: 15 },
      { per_page: -15, expected: 15 },
      { per_page: 5.5, expected: 15 },
      { per_page: true, expected: 15 },
      { per_page: false, expected: 15 },
      { per_page: {}, expected: 15 },
      { per_page: 1, expected: 1 },
      { per_page: 2, expected: 2 }
    ]

    arrange.forEach(({ per_page, expected }) => {
      test(`Per_page ${per_page} should have ${expected} value`, () => {
        expect(new SearchParams({ per_page: per_page as any }).per_page).toBe(expected)
      })
    })
  })

  describe('sort prop', () => {

    test('should have default value null', () => {
      const params = new SearchParams()
      expect(params.sort).toBeNull
    })

    const arrange = [
      { sort: null, expected: null },
      { sort: undefined, expected: null },
      { sort: '', expected: null },
      { sort: 0, expected: '0' },
      { sort: -1, expected: '-1' },
      { sort: 5.5, expected: '5.5' },
      { sort: true, expected: 'true' },
      { sort: false, expected: 'false' },
      { sort: {}, expected: '[object Object]' },
      { sort: 'field', expected: 'field' }
    ]

    arrange.forEach(({ sort, expected }) => {
      test(`Sort ${sort} should have ${expected} value`, () => {
        expect(new SearchParams({ sort: sort as any }).sort).toBe(expected)
      })
    })
  })

  describe('sort_dir prop', () => {

    test('should have default value null', () => {
      let params = new SearchParams()
      expect(params.sort_dir).toBeNull
      params = new SearchParams({ sort: '' })
      expect(params.sort_dir).toBeNull
      params = new SearchParams({ sort: '' })
      expect(params.sort_dir).toBeNull
    })

    const arrange = [
      { sort_dir: null, expected: 'asc' },
      { sort_dir: undefined, expected: 'asc' },
      { sort_dir: '', expected: 'asc' },
      { sort_dir: 0, expected: 'asc' },
      { sort_dir: 'fake', expected: 'asc' },
      
      { sort_dir: 'asc', expected: 'asc' },
      { sort_dir: 'ASC', expected: 'asc' },
      { sort_dir: 'desc', expected: 'desc' },
      { sort_dir: 'DESC', expected: 'desc' },

    ]

    arrange.forEach(({ sort_dir, expected }) => {
      test(`Sort_dir ${sort_dir} should have ${expected} value`, () => {
        expect(new SearchParams({ sort: 'field', sort_dir: sort_dir as any }).sort_dir).toBe(expected)
      })
    })
  })

  describe('filter prop', () => {

    test('should have default value null', () => {
      let params = new SearchParams()
      expect(params.filter).toBeNull
    })

    const arrange = [
      { filter: null, expected: null },
      { filter: undefined, expected: null },
      { filter: '', expected: null },
      { filter: 0, expected: '0' },
      { filter: -1, expected: '-1' },
      { filter: 5.5, expected: '5.5' },
      { filter: true, expected: 'true' },
      { filter: false, expected: 'false' },
      { filter: {}, expected: '[object Object]' },
      { filter: 'field', expected: 'field' }

    ]

    arrange.forEach(({ filter, expected }) => {
      test(`Filter ${filter} should have ${expected} value`, () => {
        expect(new SearchParams({ sort: 'field', filter: filter as any }).filter).toBe(expected)
      })
    })
  })
})