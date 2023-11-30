import { Entity } from '../entity'

type SearchResultProps<A extends Entity> = {
  items: A[]
  total: number
  current_page: number
  per_page: number
}

export class SearchResult<A extends Entity = Entity> {
  readonly items: A[]
  readonly total: number
  readonly current_page: number
  readonly per_page: number
  readonly last_page: number

  constructor(props: SearchResultProps<A>) {
    this.items = props.items
    this.total = props.total
    this.current_page = props.current_page
    this.per_page = props.per_page
    this.last_page = Math.ceil(this.total / this.per_page)
  }

  toJSON(forceAggregate = false) {
    return {
      items: forceAggregate ? this.items.map((item => item.toJSON())) : this.items,
      total: this.total,
      current_page: this.current_page,
      per_page: this.per_page,
      last_page: this.last_page
    }
  }
}