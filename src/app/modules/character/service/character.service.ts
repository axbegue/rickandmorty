import { Injectable } from '@angular/core';
import { Pagination } from '@shared/app-pagination';
import { BehaviorSubject } from 'rxjs';

import { SearchingEntity } from '@shared/util/searching-entity';
import { Character } from 'src/app/model/character';
import { CharacterBackendService } from 'src/app/service/character-backend.service';
import { Page } from '@shared/app-pagination/page';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private pagination: Pagination = new Pagination().size(50);
  private searchingSubject$: BehaviorSubject<SearchingEntity<Character>> = 
        new BehaviorSubject<SearchingEntity<Character>>(new SearchingEntity<Character>());
  private paginationSubject$: BehaviorSubject<Pagination> = new BehaviorSubject<Pagination>(this.pagination.clone());
  private entitySelectionSubject$: BehaviorSubject<Character | null> = new BehaviorSubject<Character | null>(null);
  private textoBuscado: string = '';

  constructor(private backend: CharacterBackendService) { }

  public getSearchingSubject$() {
    return this.searchingSubject$;
  }

  public getPaginationSubject$() {
    return this.paginationSubject$;
  }

  public getEntitySelectionSubject$(): BehaviorSubject<Character | null> {
    return this.entitySelectionSubject$;
  }

  public findEntities(query: string, clear: boolean) {
    this.textoBuscado = query;
    this.searchingSubject$.next(new SearchingEntity<Character>().init());

    if (clear) {
      this.pagination.pageNumber = 1;
    }
    this.backend.searchPagead(this.pagination.getpageNumber(), this.textoBuscado).subscribe({
      next: (response: Page<Character>) => {
        this.pagination.totalPages = response.totalPages;
        this.pagination.totalElements = response.totalElements;
        this.paginationSubject$.next(this.pagination.clone());
        this.searchingSubject$.next(new SearchingEntity<Character>().clear(clear).end(response.content));
      },
      error: (error: string) => {
        this.searchingSubject$.next(new SearchingEntity<Character>().end([]));
        alert(error);
      }
    });
  }

  public pageChange(page: number) {
    this.pagination.pageNumber = page;
    this.findEntities(this.textoBuscado, false);
  }

  public entitySelection(entity: Character | null) {
    this.entitySelectionSubject$.next(entity);
  }

  
  public onSearchPerformed(query: string, buttonClicked: boolean): void {
    this.textoBuscado = query;
    if (buttonClicked) {
      this.findEntities(this.textoBuscado, true);
    }
  }
}
