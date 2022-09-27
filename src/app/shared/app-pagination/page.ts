export class Page<E> {
  public totalPages: number = -1;
  public totalElements: number = -1;
  public content: E[] = [];

  public constructor();
  constructor(totalPages: number, totalElements: number)
  constructor(totalPages?: number, totalElements?: number) {
    this.totalPages = totalPages!;
    this.totalElements = totalElements!;
  }
}
