import { Injectable } from '@angular/core';
import { Pagination } from '@shared/app-pagination';
import { BehaviorSubject } from 'rxjs';

import { SearchingEntity } from '@shared/util/searching-entity';
import { Character } from 'src/app/model';
import { CharacterBackendService } from 'src/app/service/character-backend.service';
import { Page } from '@shared/app-pagination/page';
import { MathHelper } from '@shared/util/math-helper';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private pagination: Pagination = new Pagination().size(20);
  private searchingSubject$: BehaviorSubject<SearchingEntity<Character>> = 
        new BehaviorSubject<SearchingEntity<Character>>(new SearchingEntity<Character>());
  private paginationSubject$: BehaviorSubject<Pagination> = new BehaviorSubject<Pagination>(this.pagination.clone());
  private entitySelectionSubject$: BehaviorSubject<Character | null> = new BehaviorSubject<Character | null>(null);
  private textoBuscado: string = '';
  private charactersLazyload: Character[] = [];
  private onLazyload: boolean = false;

  constructor(private backend: CharacterBackendService) { }

  public initialize() {
    this.onLazyload = false;
    this.charactersLazyload = [];
    this.textoBuscado = '';
    this.findEntities('', true);
  }

  // Subjects ==========
  public getSearchingSubject$() {
    return this.searchingSubject$;
  }

  public getPaginationSubject$() {
    return this.paginationSubject$;
  }

  public getEntitySelectionSubject$(): BehaviorSubject<Character | null> {
    return this.entitySelectionSubject$;
  }

  public selectEntity(entity: Character | null) {
    this.entitySelectionSubject$.next(entity);
  }

  // Querys ===========
  public findEntities(query: string, clear: boolean) {
    // console.log('findEntities, query: ' + query);
    // console.log('findEntities, clear: ' + clear);

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
        // console.log(response.content);
        
        this.searchingSubject$.next(new SearchingEntity<Character>().clear(clear).end(response.content));
      },
      error: (error: string) => {
        this.searchingSubject$.next(new SearchingEntity<Character>().clear(true).end([]));
        // alert(error);
      }
    });
  }

  private findEntitiesLazyLoad(clear: boolean) {
    this.searchingSubject$.next(new SearchingEntity<Character>().init());

    let fromIndex: number = (this.pagination.getpageNumber()-1) * this.pagination.getPageSize();
    let toIndex: number = 0;

    if ((this.charactersLazyload.length - fromIndex - this.pagination.getPageSize()) > 0) {
      toIndex = fromIndex + this.pagination.getPageSize();
    } else {
      toIndex = fromIndex + this.charactersLazyload.length - fromIndex;
    }
    
    this.paginationSubject$.next(this.pagination.clone());
    let characters = this.charactersLazyload.slice(fromIndex, toIndex);

    this.searchingSubject$.next(new SearchingEntity<Character>().clear(clear).end(characters));
  }

  // Es llamado desde FilterService.getEntitiesByLocationUrl
  // Y es llamado desde FilterService.findCharactersFromEpisode
  // Como el servidor manda todo sin paginar en getById, las imagenes se cargarian todas a la vez por lo que pagino el contenido manualmente
  // Luego el slider tratara de paginar, donde debo dar de mi lista mientras this.onLazyload sea true
  public getEntitiesById(entityId: string) {
    this.backend.getById(entityId).subscribe({
      next: (response: Character[]) => {
        this.charactersLazyload = response;
        this.onLazyload = true;

        this.pagination.pageNumber = 1;
        this.pagination.totalPages = MathHelper.roundUp(this.charactersLazyload.length / this.pagination.getPageSize(), 0);
        this.pagination.totalElements = this.charactersLazyload.length;

        this.findEntitiesLazyLoad(true);
      },
      error: (error: string) => {
        alert(error);
      }
    });
  }

  public pageChange(page: number) {
    this.log('pageChange: ' + page);
    this.pagination.pageNumber = page;
    
    if (this.onLazyload) {
      this.log('pageChange.on LOCAL load');
      new Promise(resolve => this.findEntitiesLazyLoad(false));
    } else {
      this.log('pageChange.on REMOTE load');
      this.findEntities(this.textoBuscado, false);
    }
  }
  
  public searchEntity(query: string): void {
    this.onLazyload = false
    this.textoBuscado = query;
    this.findEntities(this.textoBuscado, true);
  }

  private log(value: any) {
    if (!environment.production) {
      console.log(value);
    }
  }
}
