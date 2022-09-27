export class Pagination {
    public pageNumber: number = 1;
    public pageSize: number = 10;
    public totalPages: number = -1;
    public totalElements: number = -1;
  
    public constructor() {}
  
    public size(pageSize: number): Pagination {
      this.pageSize = pageSize;
      return this;
    }
  
    public clone(): Pagination {
      return { ...this };
    }
  
    public getPageIndex(): number {
      return this.pageNumber -1;
    }
  
    public getpageNumber(): number {
      return this.pageNumber;
    }
  
    public getPageSize(): number {
      return this.pageSize;
    }
  
    public getTotalPages(): number {
      return this.totalPages;
    }
  
    public getTotalElements(): number {
      return this.totalElements;
    }
  }
  