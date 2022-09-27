export interface PageDto<E> {
  info: PageInfoDto,
  results: E[]
}

export interface PageInfoDto {
  count: number, // Total registers
  pages: number, // Total pages
  next: string,
  prev: string
}